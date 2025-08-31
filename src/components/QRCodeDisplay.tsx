import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Printer } from 'lucide-react';
import { useProducts, type Product } from '@/hooks/useProducts';

interface QRCodeDisplayProps {
  product: Product;
}

export const QRCodeDisplay = ({ product }: QRCodeDisplayProps) => {
  const [open, setOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { generateQRCode } = useProducts();

  const handleShowQRCode = async () => {
    if (!qrCodeUrl) {
      setLoading(true);
      try {
        const url = await generateQRCode(product.id, product.short_code);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      } finally {
        setLoading(false);
      }
    }
    setOpen(true);
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `qrcode-${product.short_code}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handlePrintLabel = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas para etiqueta (58mm x 40mm)
    canvas.width = 220;
    canvas.height = 152;
    
    // Fundo branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar QR Code
    if (qrCodeUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 10, 10, 80, 80);
        
        // Adicionar informações do produto
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(product.name.substring(0, 25), 100, 25);
        
        ctx.font = '10px Arial';
        ctx.fillText(`Código: ${product.short_code}`, 100, 45);
        ctx.fillText(`Preço: R$ ${product.price.toFixed(2)}`, 100, 65);
        ctx.fillText(`Categoria: ${product.category}`, 100, 85);
        
        // Abrir janela de impressão
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Etiqueta - ${product.short_code}</title>
                <style>
                  body { margin: 0; padding: 10px; }
                  .label { width: 58mm; height: 40mm; border: 1px solid #ccc; }
                  img { max-width: 100%; height: auto; }
                  @media print {
                    body { margin: 0; }
                    .label { border: none; }
                  }
                </style>
              </head>
              <body>
                <div class="label">
                  <img src="${canvas.toDataURL()}" alt="Etiqueta do produto" />
                </div>
                <script>window.onload = () => { window.print(); window.close(); }</script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      };
      img.src = qrCodeUrl;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleShowQRCode}>
            <QrCode className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>QR Code - {product.short_code}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              {loading ? (
                <div className="w-48 h-48 bg-muted animate-pulse mx-auto rounded" />
              ) : qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
              ) : null}
            </div>
            
            <div className="text-center space-y-2">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">Código: {product.short_code}</p>
              <p className="text-sm text-muted-foreground">Preço: R$ {product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleDownload} disabled={!qrCodeUrl} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handlePrintLabel} disabled={!qrCodeUrl} variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Etiqueta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};