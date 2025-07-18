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

// Funções para obter detalhes de produtos específicos
export const getMedicamentoById = async (id: number) => {
  const response = await api.get(`/medicamento/${id}`);
  return response.data;
};

export const getCuidadoPessoalById = async (id: number) => {
  const response = await api.get(`/cuidado-pessoal/${id}`);
  return response.data;
};

export const getSuplementoAlimentarById = async (id: number) => {
  const response = await api.get(`/suplemento-alimentar/${id}`);
  return response.data;
};
// Funções de criação de recursos
export const createMedicamento = async (data: any) => {
  const response = await api.post('/medicamento', data);
  return response.data;
};
export const createCuidadoPessoal = async (data: any) => {
  const response = await api.post('/cuidado-pessoal', data);
  return response.data;
};
export const createSuplementoAlimentar = async (data: any) => {
  const response = await api.post('/suplemento-alimentar', data);
  return response.data;
};
export const createItemEstoque = async (data: any) => {
  const response = await api.post('/item-estoque', data);
  return response.data;
};

// Cria registro de item armazenado
export const createItemArmazenado = async (data: any) => {
  const response = await api.post('/item_armazenado', data);
  return response.data;
};
// Cria armazém
export const createArmazem = async (data: any) => {
  const response = await api.post('/armazem', data);
  return response.data;
};
// Cria fornecedor
export const createFornecedor = async (data: any) => {
  const response = await api.post('/fornecedor', data);
  return response.data;
};
// Cria restrição alimentar
export const createRestricaoAlimentar = async (data: any) => {
  const response = await api.post('/restricao-alimentar', data);
  return response.data;
};
// Cria subcategoria de cuidado pessoal
export const createSubcategoriaCuidadoPessoal = async (data: any) => {
  const response = await api.post('/subcategoria-cuidado-pessoal', data);
  return response.data;
};

// Update resources
export const updateMedicamento = async (id: number, data: any) => {
  const response = await api.put(`/medicamento/${id}`, data);
  return response.data;
};
export const updateCuidadoPessoal = async (id: number, data: any) => {
  const response = await api.put(`/cuidado-pessoal/${id}`, data);
  return response.data;
};
export const updateSuplementoAlimentar = async (id: number, data: any) => {
  const response = await api.put(`/suplemento-alimentar/${id}`, data);
  return response.data;
};
// Delete item estoque
export const deleteItemEstoque = async (id: number) => {
  const response = await api.delete(`/item-estoque/${id}`);
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
