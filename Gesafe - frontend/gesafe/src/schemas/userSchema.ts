import { z } from 'zod';

//schema de validação do login
export const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

//schema de validação do cadastro
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

//schema de validação do cadastro da propriedade
export const propriedadeSchema = z.object({
    nome: z.string().min(1, 'Informe o nome da propriedade.'),
});

//schema de validação de edição do perfil
export const editarPerfilSchema = z.object({
    nome: z.string().min(1, 'Nome não pode ser vazio.'),
    email: z.string().email('Informe um e-mail válido.'),
});
