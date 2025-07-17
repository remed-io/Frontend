import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean
  message: string
  funcionario: {
    id: number
    nome: string
    email: string
    cargo: string
  }
}

export const loginFuncionario = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/funcionario/login', credentials);
  return response.data;
};

/** Estatísticas de movimentações para dashboard */
export const getEstatisticasMovimentacoes = async () => {
  return api.get<EstatisticasMovimentacao>('/relatorios/movimentacoes/estatisticas');
};

/** Estatísticas de movimentações do mês atual para dashboard */
export const getEstatisticasMovimentacoesMesAtual = async () => {
  return api.get<EstatisticasMovimentacao>('/relatorios/movimentacoes/estatisticas/mes-atual');
};
/** Estatísticas de movimentações para período selecionado */
export const getEstatisticasMovimentacoesPeriodo = async (mes: number, ano: number) => {
  return api.get<EstatisticasMovimentacao>(`/relatorios/movimentacoes/estatisticas?mes=${mes}&ano=${ano}`);
};
/** Resposta com item mais vendido/retirado no período */
export interface ItemMaisVendidoResponse {
  item: string;
}
export const getItemMaisVendidoPeriodo = async (mes: number, ano: number) => {
  const response = await api.get<ItemMaisVendidoResponse>(`/relatorios/movimentacoes/mais-vendido?mes=${mes}&ano=${ano}`);
  return response.data;
};

// Resumo de estoque para dashboard
export interface ResumoEstoque {
  total_itens: number;
  total_produtos_diferentes: number;
  produtos_vencidos: number;
  produtos_proximo_vencimento: number;
  produtos_estoque_baixo: number;
  produtos_estoque_critico: number;
  valor_total_estoque: number;
}

export interface EstoqueDetalhado {
  resumo: ResumoEstoque;
  itens: any[]; // Pode ajustar para tipo específico se necessário
}

export const getResumoEstoque = async (): Promise<ResumoEstoque> => {
  const response = await api.get<ResumoEstoque>('/consulta-estoque/resumo');
  return response.data;
};

export const getEstoqueDetalhado = async (): Promise<EstoqueDetalhado> => {
  const response = await api.get<EstoqueDetalhado>('/consulta-estoque/detalhado');
  return response.data;
};

export const getEstoqueCritico = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/consulta-estoque/critico');
  return response.data;
};

/** Alertas críticos do sistema */
export const getAlertasCriticos = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/alertas/criticos');
  return response.data;
};

// Resumo de alertas para dashboard de estoque
export interface ResumoAlertas {
  total_alertas: number;
  alertas_criticos: number;
  alertas_altos: number;
  alertas_medios: number;
  alertas_baixos: number;
  produtos_em_falta: number;
  produtos_vencidos: number;
  produtos_vencendo_hoje: number;
  produtos_vencendo_3_dias: number;
  valor_total_impactado: number;
  ultima_atualizacao: string;
}

/** Resumo de alertas do sistema para dashboard */
export const getResumoAlertas = async (): Promise<ResumoAlertas> => {
  const response = await api.get<ResumoAlertas>('/alertas/resumo');
  return response.data;
};

export default api;

// Estatísticas de movimentações para dashboard
export interface EstatisticasMovimentacao {
  total_movimentacoes: number
  total_entradas: number
  total_saidas: number
  quantidade_total_entrada: number
  quantidade_total_saida: number
  valor_total_entrada: number
  valor_total_saida: number
  periodo_inicio?: string
  periodo_fim?: string
}
