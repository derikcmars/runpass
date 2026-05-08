# Sprint 2: Formulário da Etapa 1 com Validações

## Objetivo
Implementar todos os campos do formulário da Etapa 1 (Informações Básicas) com validações em tempo real, mensagens de erro e controle de estados dos botões.

## O que NÃO faremos nesta sprint
- Integração com backend (API)
- Upload real de arquivos (apenas validação local)
- Editor WYSIWYG para descrição (textarea simples)
- Etapa 2 ou 3

---

## Critérios de Aceitação

### Campos do Formulário
- [ ] AC1: Campo "Nome da Corrida" com validação (obrigatório, 5-120 caracteres)
- [ ] AC2: Campo "URL do evento" com prefixo fixo `runpass.com.br/` e sanitização em tempo real
- [ ] AC3: Campo "Data do Evento" com date picker, valida data futura
- [ ] AC4: Campo "Horário de Largada" com time picker (24h)
- [ ] AC5: Campo "Local" com validação (obrigatório, máx 200 caracteres)
- [ ] AC6: Campo "Banner" com upload, valida formato e tamanho (5MB)
- [ ] AC7: Campo "Descrição" com textarea e contador de caracteres (máx 5000)

### Validações
- [ ] AC8: Mensagens de erro exibidas ao lado de cada campo inválido
- [ ] AC9: Botão "Próximo →" desabilitado (cinza) enquanto campos obrigatórios não preenchidos
- [ ] AC10: Botão "Próximo →" só avança se validação passar
- [ ] AC11: Slug sanitizado em tempo real (acentos removidos, espaços → hífens)

### Navegação e Persistência
- [ ] AC12: Botão "Salvar rascunho" salva no console e exibe alerta
- [ ] AC13: Dados persistem ao navegar entre etapas

### Mensagens de Erro (conforme spec)

| Campo | Erro | Mensagem |
|-------|------|----------|
| Nome | Vazio | "O nome da corrida é obrigatório." |
| Nome | < 5 caracteres | "O nome deve ter pelo menos 5 caracteres." |
| Nome | > 120 caracteres | "O nome deve ter no máximo 120 caracteres." |
| URL | Vazio | "A URL do evento é obrigatória." |
| URL | Inválido | "A URL deve conter apenas letras, números e hífens." |
| Data | Vazia | "A data do evento é obrigatória." |
| Data | Passada | "A data do evento deve ser futura." |
| Horário | Vazio | "O horário de largada é obrigatório." |
| Local | Vazio | "O local do evento é obrigatório." |
| Local | > 200 | "O local deve ter no máximo 200 caracteres." |
| Banner | Formato inválido | "Formato não suportado. Use JPG, PNG ou WebP." |
| Banner | > 5MB | "O arquivo deve ter no máximo 5 MB." |
| Descrição | > 5000 | "A descrição deve ter no máximo 5000 caracteres." |

## Estrutura de Arquivos
- `src/app/events/new/components/Step1BasicInfo.tsx` (substitui placeholder)
- `src/app/events/new/components/WizardContainer.tsx` (atualizado)
