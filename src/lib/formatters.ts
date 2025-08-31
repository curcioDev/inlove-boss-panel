// Utilitários de formatação para o sistema In Love

export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
};

export const parseCurrency = (value: string): number => {
  // Remove todos os caracteres que não são dígitos, vírgula ou ponto
  const cleanValue = value.replace(/[^\d,.-]/g, '');
  // Substitui vírgula por ponto para parsing correto
  const normalizedValue = cleanValue.replace(',', '.');
  return parseFloat(normalizedValue) || 0;
};

export const formatCurrencyInput = (value: string): string => {
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Converte para centavos
  const cents = parseInt(numbers);
  const reais = cents / 100;
  
  return formatCurrency(reais);
};

// Categorias de produtos pré-definidas
export const PRODUCT_CATEGORIES = [
  'Lingerie',
  'Pijama',
  'Moda Praia',
  'Moda Íntima',
  'Camisolas',
  'Roupão',
  'Meias',
  'Acessórios',
  'Body',
  'Cinta',
  'Sutiã',
  'Calcinha'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];