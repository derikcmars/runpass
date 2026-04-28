# Especificação do Wizard de Cadastro de Corrida (spec-cadastro-corrida.md)

## Etapa 1 — Informações Básicas

### 1. Objetivo
Coletar as informações fundamentais do evento: identificação, data, local, identidade visual e URL pública personalizada. A URL é definida livremente pelo organizador.

### 2. Campos

| # | Campo | Tipo | Obrigatório | Validações |
|---|-------|------|-------------|------------|
| 1 | Nome da Corrida | Texto livre (string) | Sim | Mínimo 5, máximo 120 caracteres |
| 2 | URL do evento | Texto com prefixo fixo (string) | Sim | Campo preenchido manualmente pelo organizador. Regras: minúsculo, sem acentos, espaços substituídos por hífens, sem caracteres especiais. Máximo 80 caracteres. Unicidade validada no banco. |
| 3 | Data do Evento | Date picker (ISO 8601) | Sim | Data futura. Formato: `YYYY-MM-DD`. |
| 4 | Horário de Largada | Time picker (HH:MM) | Sim | Formato 24h. Ex: `06:00`. |
| 5 | Local | Texto livre (string) | Sim | Máximo 200 caracteres |
| 6 | Banner | Upload de imagem | Não | Formatos aceitos: JPG, PNG, WebP. Dimensão recomendada: 1920×600px. Tamanho máximo: 5 MB. |
| 7 | Descrição | Editor WYSIWYG (texto rico) | Não | Máximo 5000 caracteres. Suporta formatação básica (negrito, itálico, listas, links). |

### 3. Comportamento do Campo URL

- O campo "URL do evento" é exibido com o prefixo fixo `runpass.com.br/` à esquerda, não editável.
- O organizador digita manualmente o slug desejado (ex: `minha-corrida-2026`).
- O sistema não gera automaticamente o slug a partir do nome. A URL é totalmente independente.
- Validação em tempo real: à medida que o organizador digita, o sistema remove caracteres inválidos (acentos, espaços, caracteres especiais) e converte para minúsculas automaticamente. Exemplo: se digitar `Minha Corrida 2026!`, o campo transforma para `minha-corrida-2026`.
- Ao salvar, o sistema valida a unicidade do slug para a organização. Se duplicado, exibe o erro "Esta URL já está em uso. Escolha outra."

### 4. Mensagens de Erro

| Campo | Erro | Mensagem |
|-------|------|----------|
| Nome da Corrida | Vazio | "O nome da corrida é obrigatório." |
| Nome da Corrida | Menos de 5 caracteres | "O nome deve ter pelo menos 5 caracteres." |
| Nome da Corrida | Mais de 120 caracteres | "O nome deve ter no máximo 120 caracteres." |
| URL do evento | Vazio | "A URL do evento é obrigatória." |
| URL do evento | Slug duplicado | "Esta URL já está em uso. Escolha outra." |
| URL do evento | Caracteres inválidos | "A URL deve conter apenas letras, números e hífens." |
| Data do Evento | Vazia | "A data do evento é obrigatória." |
| Data do Evento | Data passada | "A data do evento deve ser futura." |
| Horário de Largada | Vazio | "O horário de largada é obrigatório." |
| Local | Vazio | "O local do evento é obrigatório." |
| Banner | Formato inválido | "Formato não suportado. Use JPG, PNG ou WebP." |
| Banner | Tamanho excedido | "O arquivo deve ter no máximo 5 MB." |
| Descrição | Mais de 5000 caracteres | "A descrição deve ter no máximo 5000 caracteres." |

### 5. Estados dos Botões

| Botão | Estado Normal | Estado Carregando | Estado Desabilitado |
|-------|---------------|-------------------|---------------------|
| Salvar rascunho | Azul, habilitado | Texto "Salvando..." + spinner, desabilitado | Cinza, desabilitado (quando não há alterações) |
| Próximo → | Azul, habilitado | Texto "Avançando..." + spinner, desabilitado | Cinza, desabilitado (quando campos obrigatórios não preenchidos) |

### 6. Integração com o Backend

- **Endpoint**: `POST /api/v1/events` (criação) ou `PUT /api/v1/events/:id` (edição).
- **Autenticação**: Requer JWT válido do organizador.
- **Dados enviados**: todos os campos da etapa, incluindo arquivo de banner via `multipart/form-data`.
- **Resposta de sucesso**: `201 Created` com o objeto do evento criado (incluindo `id` e `slug`).
- **Resposta de erro**: `422 Unprocessable Entity` com detalhes dos campos inválidos (formato RFC 7807 Problem Details).

### 7. Navegação
- **Salvar rascunho**: Salva os dados e permanece na Etapa 1.
- **Próximo →**: Salva os dados e avança para a Etapa 2 — Percursos e Distâncias.
- **← Voltar**: Retorna ao dashboard (etapa anterior ao wizard).




---


## Etapa 2 — Percursos e Distâncias

### 1. Objetivo
Permitir que o organizador cadastre os percursos da corrida, definindo distância, modalidade, horário de largada e numeração de peito. Cada percurso possui uma única modalidade. Categorias especiais (PCD, +60, etc.) são tratadas como lotes específicos na Etapa 3, não como checkboxes nesta etapa.

### 2. Estrutura da Tabela de Percursos

| # | Coluna | Tipo | Obrigatório | Descrição |
|---|--------|------|-------------|-----------|
| 1 | Distância | Numérico + sugestões | Sim | Distância em km (1-200) |
| 2 | Modalidade | Select único | Sim | Uma modalidade por percurso |
| 3 | Largada | Time picker (HH:MM) | Sim | Horário de largada |
| 4 | Nº Peito | Select + campos condicionais | Sim | Configuração da numeração |
| 5 | Categoria | Select (Padrão/Especiais) | Sim | Define se o percurso terá lotes especiais |
| 6 | Ações | Botão | — | Excluir percurso |

### 3. Especificação dos Campos

#### 3.1 Distância
- **Tipo**: Campo numérico com valor mínimo `1` e máximo `200` (km).
- **Sugestões rápidas**: Botões acima do campo com as distâncias mais comuns: `5 km`, `10 km`, `21 km`, `42 km`. Ao clicar, preenchem automaticamente o campo numérico.
- **Validação**: Obrigatório. Deve ser um número (inteiro ou decimal). Valor entre 1 e 200.
- **Mensagem de erro**: "A distância deve ser um número entre 1 e 200 km."

#### 3.2 Modalidade
- **Tipo**: Select único (dropdown).
- **Opções pré-definidas**: `Corrida`, `Caminhada`, `Trilha`.
- **Criação de modalidade customizada**: Ao lado do dropdown, um botão "Nova modalidade" permite ao organizador digitar um nome personalizado (ex: "Corrida noturna"). Essa nova modalidade é salva e fica disponível para outros percursos no mesmo evento.
- **Validação**: Obrigatório. Apenas uma modalidade pode ser selecionada por percurso.
- **Mensagem de erro**: "Selecione uma modalidade."

#### 3.3 Horário de Largada
- **Tipo**: Time picker no formato 24h (`HH:MM`).
- **Validação**: Obrigatório. Deve ser um horário válido.
- **Mensagem de erro**: "O horário de largada é obrigatório."

#### 3.4 Numeração de Peito
- **Tipo**: Select com duas opções e campos condicionais.
- **Opções**:
  - `Automático`: O organizador define um número inicial. O sistema gera sequencialmente a partir dele.
  - `Manual (faixa)`: O organizador define um intervalo (número inicial e número final).
- **Campos condicionais**:
  - Modo Automático: campo `Início` (numérico, obrigatório).
  - Modo Manual: campos `De` e `Até` (numéricos, obrigatórios).
- **Validação**: As faixas de diferentes percursos **não podem se sobrepor**. Exemplo: 21 km com faixa `200-800` e 10 km com faixa `700-1200` gera erro de sobreposição.
- **Mensagem de erro de sobreposição**: "A faixa de numeração escolhida entra em conflito com o percurso [nome do percurso]. Ajuste os valores."

#### 3.5 Categoria (Padrão ou Especiais)
- **Tipo**: Select único.
- **Opções**:
  - `Padrão`: O percurso terá apenas lotes normais, configurados na Etapa 3.
  - `Especiais`: O percurso terá lotes especiais (ex: PCD, +60 anos). Ao selecionar esta opção, o organizador deverá cadastrar, na Etapa 3, um ou mais lotes especiais, onde definirá:
    - Nome do lote especial (ex: "PCD", "+60", "Cadeirantes").
    - Preço único (com desconto ou não).
    - Quantidade de vagas.
    - Critério de encerramento (data, quantidade ou combinado).
- **Comportamento esperado na Etapa 3**: Se a categoria for "Especiais", a interface de lotes da Etapa 3 exibirá, para esse percurso, uma seção separada para cadastro dos lotes especiais, com os campos mencionados acima. Lotes especiais não participam da dinâmica de virada por percurso (são independentes e têm seu próprio critério de encerramento).
- **Validação**: Obrigatório.
- **Mensagem de erro**: "Selecione uma categoria para o percurso."

### 4. Ações da Tabela

| Ação | Gatilho | Comportamento |
|------|---------|---------------|
| **Adicionar percurso** | Botão "+ Adicionar percurso" | Insere nova linha com valores padrão: Distância vazia, Modalidade "Corrida", Largada `06:00`, Peito Automático (início 1), Categoria "Padrão". |
| **Excluir percurso** | Botão 🗑 em cada linha | Remove o percurso. Se for o único percurso, o botão é desabilitado (mínimo de 1 percurso por evento). |

### 5. Validações Cruzadas
- **Sobreposição de numeração de peito**: Validada ao salvar/avançar.
- **Mínimo de percursos**: Pelo menos 1 percurso deve existir.
- **Duplicidade de distância + modalidade**: O sistema pode alertar, mas não bloquear.

### 6. Mensagens de Erro

| Situação | Mensagem |
|----------|----------|
| Nenhum percurso cadastrado | "Adicione pelo menos um percurso." |
| Distância vazia | "A distância é obrigatória." |
| Distância fora do intervalo | "A distância deve ser entre 1 e 200 km." |
| Modalidade não selecionada | "Selecione uma modalidade." |
| Horário de largada vazio | "O horário de largada é obrigatório." |
| Sobreposição de numeração | "A faixa de numeração entra em conflito com o percurso [nome]." |
| Categoria não selecionada | "Selecione uma categoria." |

### 7. Integração com o Backend
- **Endpoint**: `POST /api/v1/events/:eventId/courses` (criação) ou `PUT /api/v1/events/:eventId/courses/:id` (edição).
- **Dados enviados**: Array de objetos de percurso, cada um com: `distance`, `modality`, `startTime`, `bibAutoStart` ou `bibStart`/`bibEnd`, `categoryType` (`standard` ou `special`).
- **Respostas**: `200 OK` ou `422 Unprocessable Entity`.

### 8. Navegação
- **← Voltar**: Retorna para a Etapa 1.
- **Próximo →**: Salva e avança para a Etapa 3 — Lotes, Vagas e Preços.