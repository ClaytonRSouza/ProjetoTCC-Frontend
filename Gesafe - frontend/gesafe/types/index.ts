export interface Propriedade {
    id: number;
    nome: string;
}

export interface Produto {
    nome: string;
    embalagem: string;
    validade: string;
    quantidade: number;
    propriedadeNome?: string;
    vencido?: boolean;
}

export interface Movimentacao {
    data: string;
    tipo: string;
    produtoNome: string;
    quantidade: number;
    propriedadeNome: string;
    justificativa?: string;
}