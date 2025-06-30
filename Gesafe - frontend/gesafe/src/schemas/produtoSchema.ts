import { z } from 'zod';

//schema de validação do produto
export const produtoSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(50, "Nome do produto deve ter no máximo 50 caracteres"),
    quantidade: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Quantidade deve ser um número válido maior que 0',
        }),
    validade: z
        .string()
        .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato da validade deve ser DD/MM/AAAA'),
    embalagem: z.string().min(1, 'Selecione uma embalagem'),
    propriedadeId: z.number().min(1, 'Selecione uma propriedade'),
});

//schema de validação da edição do produto
export const editarProdutoSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(50, "Nome do produto deve ter no máximo 50 caracteres"),
    validade: z.string().min(1, 'Validade é obrigatória'),
    embalagem: z.enum([
        'SACARIA', 'BAG_1TN', 'BAG_750KG', 'LITRO',
        'GALAO_2L', 'GALAO_5L', 'GALAO_10L',
        'BALDE_20L', 'TAMBOR_200L', 'IBC_1000L',
        'PACOTE_1KG', 'PACOTE_5KG', 'PACOTE_10KG',
        'PACOTE_15KG', 'PACOTE_500G', 'OUTROS'
    ], { errorMap: () => ({ message: 'Selecione uma embalagem válida' }) })
});

//schema de validação da desativação do produto
export const desativarProdutoSchema = z.object({
    justificativa: z.string().min(10, "A justificativa é obrigatória e deve ter pelo menos 10 caracteres"),
});

//schema de validação da saída do produto
export const saidaProdutoSchema = z.object({
    quantidade: z.coerce.number()
        .positive('Quantidade deve ser maior que zero')
});