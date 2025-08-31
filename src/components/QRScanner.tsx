'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, X, AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { ProductView } from './ProductView';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QrScanner from 'qr-scanner';

// Worker path (fallbacks para diferentes bundlers)
try {
  // webpack/Next moderno
  // @ts-ignore
  QrScanner.WORKER_PATH = new URL('qr-scanner/qr-scanner-worker.min.js', import.meta.url).toString();
} catch {
  // Vite: descomente se precisar e tiver suporte a ?url
  // import workerUrl from 'qr-scanner/qr-scanner-worker.min.js?url';
  // QrScanner.WORKER_PATH = workerUrl;
}

interface QRScannerProps {
  trigger?: React.ReactNode;
}

export const QRScanner = ({ trigger }: QRScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [showProductView, setShowProductView] = useState(false);

  const [isSecure, setIsSecure] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const preflightStreamRef = useRef<MediaStream | null>(null);

  const { products } = useProducts();
  const { toast } = useToast();

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        // gesto do usuário: abre e já inicia
        setIsOpen(true);
        // dar um tick para o <video> estar no DOM
        setTimeout(() => startCamera(), 0);
      }}
    >
      <QrCode className="h-4 w-4 mr-2" />
      Scanner QR
    </Button>
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSecure(
        window.isSecureContext ||
        window.location.protocol === 'https:' ||
        window.location.hostname === 'localhost'
      );
      setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || ''));
    }
  }, []);

  const checkBrowserSupport = () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      toast({
        title: 'Navegador não suportado',
        description: 'Use Chrome, Firefox ou Safari atualizados.',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const selectCameraId = async () => {
    // garante permissão e acesso a labels
    const cameras = await QrScanner.listCameras(true);
    const back = cameras.find(c => /back|traseira|rear|environment/i.test(c.label));
    return back?.id || cameras[0]?.id || null;
  };

  const startCamera = async () => {
    if (!videoRef.current) return;

    if (!isSecure) {
      setHasPermission(false);
      toast({
        title: 'HTTPS Obrigatório',
        description: 'Funciona só em HTTPS ou localhost.',
        variant: 'destructive'
      });
      return;
    }
    if (!checkBrowserSupport()) {
      setHasPermission(false);
      return;
    }

    try {
      setHasPermission(null);

      // flags iOS antes de tocar
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.setAttribute('autoplay', '');

      // 1) Escolhe câmera (tenta traseira)
      const deviceId = await selectCameraId();

      // 2) Pré-permissão e preview real (GESTO do usuário garantido no onClick)
      const preConstraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: isMobile ? 'environment' : 'user' }
      };
      const preflightStream = await navigator.mediaDevices.getUserMedia(preConstraints);
      preflightStreamRef.current = preflightStream;

      // mostra vídeo imediatamente
      videoRef.current.srcObject = preflightStream;
      await videoRef.current.play();

      // 3) Cria scanner e inicia (ele pode trocar o stream interno)
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        res => handleQRCodeDetected(res.data),
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 2,
          preferredCamera: isMobile ? 'environment' : 'user',
        }
      );

      if (deviceId) {
        await qrScannerRef.current.setCamera(deviceId);
      }
      await qrScannerRef.current.start();

      // se o QrScanner trocou o stream, libera o preflight antigo
      const current = videoRef.current.srcObject as MediaStream | null;
      if (current && preflightStreamRef.current && current !== preflightStreamRef.current) {
        preflightStreamRef.current.getTracks().forEach(t => t.stop());
        preflightStreamRef.current = null;
      }

      setHasPermission(true);
      setIsScanning(true);

      toast({
        title: '📱 Câmera ativa',
        description: isMobile ? 'Usando a traseira (quando disponível).' : 'Posicione o QR na frente da webcam.',
      });
    } catch (error: any) {
      console.error('Erro ao iniciar câmera:', error);
      setHasPermission(false);

      let errorMessage = 'Não foi possível acessar a câmera.';
      let instructions = '';

      switch (error?.name) {
        case 'NotAllowedError':
          errorMessage = 'Permissão negada.';
          instructions = isMobile
            ? 'Toque no cadeado/câmera na barra de endereços e permita.'
            : 'Clique no ícone da câmera na barra de endereços e permita.';
          break;
        case 'NotFoundError':
          errorMessage = 'Nenhuma câmera encontrada.';
          instructions = isMobile ? 'Verifique se há câmera no dispositivo.' : 'Conecte uma webcam.';
          break;
        case 'NotSupportedError':
          errorMessage = 'Navegador não suporta câmera.';
          instructions = 'Use Chrome, Firefox ou Safari atualizados.';
          break;
        case 'NotReadableError':
          errorMessage = 'Câmera em uso por outro app.';
          instructions = 'Feche outros apps que usam a câmera.';
          break;
        case 'OverconstrainedError':
          errorMessage = 'Configuração de câmera não suportada.';
          instructions = 'Tente outra câmera/dispositivo.';
          break;
      }

      toast({
        title: 'Erro no Scanner QR',
        description: `${errorMessage} ${instructions}`,
        variant: 'destructive'
      });
    }
  };

  const stopCamera = () => {
    try {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      if (preflightStreamRef.current) {
        preflightStreamRef.current.getTracks().forEach(t => t.stop());
        preflightStreamRef.current = null;
      }
    } catch {}
    setIsScanning(false);
  };

  const handleQRCodeDetected = async (qrData: string) => {
    stopCamera();
    try {
      const clean = qrData.trim();
      let product: Product | null =
        products.find(p => p.qr_code === clean) || null;

      if (!product) {
        const parts = clean.split(':');
        if (parts.length === 3 && parts[0] === 'inlove_product') {
          const [, productId, shortCode] = parts;
          product = products.find(p => p.id === productId || p.short_code === shortCode) || null;
        }
      }

      if (!product) {
        product = products.find(p =>
          clean.includes(p.short_code) ||
          clean.includes(p.id) ||
          p.qr_code.includes(clean)
        ) || null;
      }

      if (!product) {
        const lc = clean.toLowerCase();
        product = products.find(p =>
          p.name.toLowerCase().includes(lc) ||
          lc.includes(p.name.toLowerCase().substring(0, 5))
        ) || null;
      }

      if (product) {
        setFoundProduct(product);
        setShowProductView(true);
        setIsOpen(false);
        toast({ title: '🎉 Produto encontrado!', description: `${product.name} - Código: ${product.short_code}` });
      } else {
        toast({
          title: '📦 Produto não encontrado',
          description: `QR: "${clean.length > 20 ? clean.slice(0, 20) + '...' : clean}" não cadastrado.`,
          variant: 'destructive'
        });
        setIsScanning(false);
        setHasPermission(true);
        setTimeout(() => {
          if (videoRef.current && isOpen) startCamera();
        }, 3000);
      }
    } catch {
      toast({
        title: '⚠️ Erro ao processar QR Code',
        description: 'Tente novamente.',
        variant: 'destructive'
      });
      setIsScanning(false);
      setTimeout(() => {
        if (isOpen) startCamera();
      }, 2000);
    }
  };

  useEffect(() => {
    if (!isOpen) stopCamera();
    return () => stopCamera();
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
              Scanner QR Code
              {isMobile && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Mobile</span>}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!isSecure && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>⚠️ Requer HTTPS (ou localhost).</AlertDescription>
              </Alert>
            )}

            {hasPermission === null && (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-primary" />
                </div>
                <p className="text-muted-foreground mb-2">🔐 Solicitando permissão…</p>
                <p className="text-xs text-muted-foreground">
                  {isMobile ? 'Permita o acesso quando solicitado' : 'Clique em "Permitir" quando solicitado'}
                </p>
              </div>
            )}

            {hasPermission && (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg bg-black"
                  playsInline
                  muted
                  style={{ aspectRatio: '4/3' }}
                />
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="border-2 border-primary w-48 h-48 rounded-lg bg-transparent relative">
                        <div className="absolute -top-1 -left-1 border-l-4 border-t-4 border-primary w-8 h-8 rounded-tl-lg"></div>
                        <div className="absolute -top-1 -right-1 border-r-4 border-t-4 border-primary w-8 h-8 rounded-tr-lg"></div>
                        <div className="absolute -bottom-1 -left-1 border-l-4 border-b-4 border-primary w-8 h-8 rounded-bl-lg"></div>
                        <div className="absolute -bottom-1 -right-1 border-r-4 border-b-4 border-primary w-8 h-8 rounded-br-lg"></div>
                        <div className="absolute inset-2 overflow-hidden rounded">
                          <div className="h-0.5 bg-primary w-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">📷 Posicione o QR aqui</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {isMobile ? '📱 Câmera Traseira' : '💻 Webcam'}
                </div>
              </div>
            )}

            {hasPermission === false && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p>🚫 Permissão negada.</p>
                  <p className="text-sm">
                    {isMobile
                      ? 'Toque no cadeado/câmera na barra de endereços e permita.'
                      : 'Clique no ícone de câmera na barra de endereços e permita.'}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setHasPermission(null);
                      startCamera();
                    }}
                    className="w-full mt-2"
                  >
                    🔄 Tentar Novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProductView
        product={foundProduct}
        isOpen={showProductView}
        onClose={() => {
          setFoundProduct(null);
          setShowProductView(false);
        }}
      />
    </>
  );
};
