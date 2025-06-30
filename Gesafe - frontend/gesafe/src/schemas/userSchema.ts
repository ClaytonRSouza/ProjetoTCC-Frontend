import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export const registerSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    propriedades: z.array(
        z.object({
            nome: z.string().min(1, 'Propriedade não pode estar vazia'),
        })
    ).min(1, 'Informe pelo menos uma propriedade'),
});

export const propriedadeSchema = z.object({
    nome: z.string().min(1, 'Informe o nome da propriedade.'),
});

export const editarPerfilSchema = z.object({
    nome: z.string().min(1, 'Nome não pode ser vazio.'),
    email: z.string().email('Informe um e-mail válido.'),
});
