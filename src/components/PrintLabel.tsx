import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/formatters";

interface PrintLabelProps {
  product: Product;
}

export const PrintLabel = ({ product }: PrintLabelProps) => {
  const handlePrint = () => {
    // Criar conteúdo da etiqueta otimizado para impressoras pequenas (tipo Zebra)
    const labelContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Etiqueta - ${product.name}</title>
          <style>
            @media print {
              @page {
                size: 50mm 30mm;
                margin: 2mm;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                font-size: 8pt;
                line-height: 1.2;
              }
            }
            
            body {
              width: 50mm;
              height: 30mm;
              margin: 0;
              padding: 2mm;
              font-family: Arial, sans-serif;
              font-size: 8pt;
              line-height: 1.2;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            
            .header {
              text-align: center;
              font-weight: bold;
              font-size: 7pt;
              margin-bottom: 1mm;
            }
            
            .product-name {
              font-weight: bold;
              font-size: 9pt;
              text-align: center;
              margin-bottom: 1mm;
              /* Truncar nome se muito longo */
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .price {
              font-size: 12pt;
              font-weight: bold;
              text-align: center;
              margin: 1mm 0;
            }
            
            .bottom-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-size: 6pt;
            }
            
            .qr-code {
              width: 15mm;
              height: 15mm;
              border: 1px solid #000;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 4pt;
              text-align: center;
            }
            
            .product-code {
              font-weight: bold;
              font-size: 7pt;
            }
          </style>
        </head>
        <body>
          <div class="header">IN LOVE</div>
          
          <div class="product-name">${product.name.substring(0, 25)}${product.name.length > 25 ? '...' : ''}</div>
          
          <div class="price">${formatCurrency(product.price)}</div>
          
          <div class="bottom-section">
            <div>
              <div class="product-code">${product.short_code}</div>
              <div>Est: ${product.stock_quantity}</div>
            </div>
            
            <div class="qr-code">
              QR
              <br>
              ${product.short_code}
            </div>
          </div>
        </body>
      </html>
    `;

    // Abrir nova janela para impressão
    const printWindow = window.open('', '_blank', 'width=300,height=200');
    if (printWindow) {
      printWindow.document.write(labelContent);
      printWindow.document.close();
      
      // Aguardar carregamento e imprimir
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // Fechar janela após impressão
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      };
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handlePrint}
      className="h-8 w-8 p-0 hover:bg-blue-500 hover:text-white"
      title="Imprimir etiqueta"
    >
      <Printer className="h-3 w-3" />
    </Button>
  );
};