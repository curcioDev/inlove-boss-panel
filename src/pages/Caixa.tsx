import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, TrendingUp, Download, RefreshCw, Lock } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { RealTimeClock } from "@/components/RealTimeClock";
import { useToast } from "@/hooks/use-toast";

interface CashMovement {
  id: string;
  type: 'sale' | 'consignment_return' | 'consignment_sale' | 'adjustment';
  amount: number;
  description: string;
  created_at: string;
  reference_id?: string;
}

interface DailyCashSummary {
  date: string;
  opening_balance: number;
  sales_total: number;
  consignment_sales: number;
  consignment_returns: number;
  adjustments: number;
  closing_balance: number;
  is_closed: boolean;
}

export default function Caixa() {
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [dailySummary, setDailySummary] = useState<DailyCashSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [closingDay, setClosingDay] = useState(false);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  // Simulação de dados - em produção, viria do Supabase
  useEffect(() => {
    const loadCashData = async () => {
      setLoading(true);
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const mockMovements: CashMovement[] = [
        {
          id: '1',
          type: 'sale',
          amount: 89.90,
          description: 'Venda - Conjunto Lingerie Rosa',
          created_at: new Date().toISOString(),
          reference_id: 'PED001'
        },
        {
          id: '2',
          type: 'sale',
          amount: 45.50,
          description: 'Venda - Pijama Azul',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          reference_id: 'PED002'
        },
        {
          id: '3',
          type: 'consignment_sale',
          amount: 120.00,
          description: 'Venda Consignado - Body Preto',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          reference_id: 'CON001'
        }
      ];

      const mockSummary: DailyCashSummary = {
        date: today,
        opening_balance: 100.00,
        sales_total: 135.40,
        consignment_sales: 120.00,
        consignment_returns: 0,
        adjustments: 0,
        closing_balance: 355.40,
        is_closed: false
      };

      setMovements(mockMovements);
      setDailySummary(mockSummary);
      setLoading(false);
    };

    loadCashData();
  }, [today]);

  const handleCloseCashier = async () => {
    if (!dailySummary) return;

    setClosingDay(true);
    try {
      // Simular fechamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDailySummary(prev => prev ? { ...prev, is_closed: true } : null);
      
      toast({
        title: 'Caixa fechado com sucesso',
        description: `Fechamento do dia ${new Date().toLocaleDateString('pt-BR')} realizado.`
      });
    } catch (error) {
      toast({
        title: 'Erro ao fechar caixa',
        description: 'Não foi possível realizar o fechamento.',
        variant: 'destructive'
      });
    } finally {
      setClosingDay(false);
    }
  };

  const handleExportReport = () => {
    toast({
      title: 'Relatório exportado',
      description: 'O relatório PDF foi gerado com sucesso.'
    });
  };

  const getMovementIcon = (type: CashMovement['type']) => {
    switch (type) {
      case 'sale':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'consignment_sale':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'consignment_return':
        return <RefreshCw className="h-4 w-4 text-orange-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMovementLabel = (type: CashMovement['type']) => {
    switch (type) {
      case 'sale':
        return 'Venda';
      case 'consignment_sale':
        return 'Venda Consignado';
      case 'consignment_return':
        return 'Retorno Consignado';
      default:
        return 'Ajuste';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Caixa</h1>
            <p className="text-muted-foreground mt-1">Controle de movimentação diária</p>
          </div>
          <RealTimeClock />
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-3d">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Caixa</h1>
          <p className="text-muted-foreground mt-1">
            Controle de movimentação diária - {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <RealTimeClock />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            {dailySummary && !dailySummary.is_closed && (
              <Button 
                className="btn-gradient" 
                onClick={handleCloseCashier}
                disabled={closingDay}
              >
                {closingDay ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                {closingDay ? 'Fechando...' : 'Fechar Caixa'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {dailySummary && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="card-3d">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-500">
                      {formatCurrency(dailySummary.opening_balance)}
                    </p>
                    <p className="text-sm text-muted-foreground">Saldo Inicial</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-3d">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      {formatCurrency(dailySummary.sales_total)}
                    </p>
                    <p className="text-sm text-muted-foreground">Vendas Diretas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-3d">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-purple-500">
                      {formatCurrency(dailySummary.consignment_sales)}
                    </p>
                    <p className="text-sm text-muted-foreground">Consignados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-3d">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(dailySummary.closing_balance)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total do Dia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge 
              variant={dailySummary.is_closed ? "default" : "secondary"}
              className="text-sm py-2 px-4"
            >
              {dailySummary.is_closed ? (
                <><Lock className="h-4 w-4 mr-2" /> Caixa Fechado</>
              ) : (
                <><Calendar className="h-4 w-4 mr-2" /> Caixa Aberto</>
              )}
            </Badge>
          </div>
        </>
      )}

      {/* Movements */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Movimentações do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma movimentação registrada hoje</p>
              </div>
            ) : (
              movements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {getMovementIcon(movement.type)}
                    <div>
                      <p className="font-medium">{movement.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{getMovementLabel(movement.type)}</span>
                        {movement.reference_id && (
                          <>
                            <span>•</span>
                            <span>#{movement.reference_id}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>
                          {new Date(movement.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-500">
                      + {formatCurrency(movement.amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}