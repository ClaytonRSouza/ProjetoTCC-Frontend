//cria tipagem de propriedade
export interface Propriedade {
    id: number;
    nome: string;
}

//cria tipagem de produto
export interface Produto {
    nome: string;
    embalagem: string;
    validade: string;
    quantidade: number;
    propriedadeNome?: string;
    vencido?: boolean;
}

//cria tipagem de movimentacao
export interface Movimentacao {
    data: string;
    tipo: string;
    produtoNome: string;
    quantidade: number;
    propriedadeNome: string;
    justificativa?: string;
}