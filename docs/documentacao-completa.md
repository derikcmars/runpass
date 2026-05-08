# Documentação Completa — Runpass

> **Projeto:** Plataforma SaaS B2B para gestão de corridas de rua
> **Stack:** Next.js 16 + Tailwind CSS 4 + TypeScript (frontend) | NestJS + PostgreSQL 16 + Prisma (backend)
> **Status:** Em desenvolvimento — Sprint 2 em andamento

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Estrutura do Projeto](#2-estrutura-do-projeto)
3. [Sprint 1 — Estrutura do Wizard](#3-sprint-1--estrutura-do-wizard)
4. [Sprint 2 — Formulário da Etapa 1](#4-sprint-2--formulário-da-etapa-1)
5. [Arquitetura dos Componentes](#5-arquitetura-dos-componentes)
6. [Fluxo de Dados](#6-fluxo-de-dados)
7. [Validações e Regras de Negócio](#7-validações-e-regras-de-negócio)
8. [Estados dos Componentes](#8-estados-dos-componentes)
9. [Histórico de Correções](#9-histórico-de-correções)
10. [Próximos Passos](#10-próximos-passos)

---

## 1. Visão Geral do Projeto

O **Runpass** é uma plataforma que permite que organizadores de corridas de rua cadastrem e gerenciem eventos esportivos de forma completa. O MVP contempla:

1. **Cadastro de Corrida (Wizard):** Fluxo em etapas para criação de um evento.
2. **Portal Público do Evento:** Página pública com informações e inscrição de atletas.
3. **Painel do Organizador:** Dashboard com gerenciamento de inscrições e relatórios.

### Fora do Escopo do MVP
- Aplicativo mobile nativo
- Internacionalização (i18n)
- Marketplace de eventos

---

## 2. Estrutura do Projeto

```
runpass/
├── src/
│   └── app/
│       └── events/
│           └── new/
│               ├── page.tsx                           # Rota /events/new
│               └── components/
│                   ├── WizardContainer.tsx              # Gerenciador de estado e navegação
│                   ├── StepIndicator.tsx                # Indicador "Etapa X de 3"
│                   ├── Step1BasicInfo.tsx               # Etapa 1 — Informações Básicas
│                   ├── Step2Courses.tsx                  # Etapa 2 — Placeholder (Sprint 3)
│                   └── Step3Lots.tsx                     # Etapa 3 — Placeholder (Sprint 4)
├── docs/
│   ├── 1-spec.md                                       # SPEC técnica inicial
│   ├── architecture.md                                 # Arquitetura do sistema
│   ├── constitution.md                                 # Regras do projeto
│   ├── documentacao-completa.md                        # ⬅️ Este arquivo
│   ├── progress.json                                   # Progresso das sprints
│   ├── prototipo-wizard-corrida.html                   # Protótipo HTML navegável
│   ├── specs/
│   │   └── spec-cadastro-corrida.md                    # Especificação detalhada do wizard
│   └── sprints/
│       ├── sprint-1-estrutura.md                       # Planejamento da Sprint 1
│       └── sprint-2-formularios.md                     # Planejamento da Sprint 2
```

---

## 3. Sprint 1 — Estrutura do Wizard

**Status:** ✅ Concluída

### Objetivo
Criar o esqueleto do wizard com navegação entre 3 etapas e persistência de estado. Nenhum campo de formulário foi implementado — apenas placeholders.

### Critérios de Aceitação Concluídos

| AC | Descrição | Status |
|----|-----------|--------|
| AC1 | Acessar `/events/new` renderiza o wizard | ✅ |
| AC2 | Título "Etapa 1 de 3: Informações Básicas" | ✅ |
| AC3 | Indicador "Etapa X de 3" visível no topo | ✅ |
| AC4 | Botão "Próximo →" leva à Etapa 2 | ✅ |
| AC5 | Etapa 2 exibe placeholder "Percursos e Distâncias" | ✅ |
| AC6 | Botão "← Voltar" na Etapa 2 retorna à Etapa 1 | ✅ |
| AC7 | Botão "Próximo" na Etapa 2 leva à Etapa 3 | ✅ |
| AC8 | Etapa 3 exibe placeholder "Lotes, Vagas e Preços" | ✅ |
| AC9 | Botão "Próximo" fica oculto na Etapa 3 | ✅ |
| AC10 | `eventData` persiste ao trocar de etapa | ✅ |
| AC11 | `eventData` começa com 7 campos vazios | ✅ |
| AC12 | Dados preenchidos permanecem ao voltar | ✅ |

### Arquivos Criados na Sprint 1

| Arquivo | Descrição |
|---------|-----------|
| `src/app/events/new/page.tsx` | Ponto de entrada que renderiza o `WizardContainer` |
| `src/app/events/new/components/WizardContainer.tsx` | Gerencia `currentStep`, `eventData` e navegação |
| `src/app/events/new/components/StepIndicator.tsx` | Exibe "Etapa X de 3" |
| `src/app/events/new/components/Step1BasicInfo.tsx` | Placeholder substituído na Sprint 2 |
| `src/app/events/new/components/Step2Courses.tsx` | Placeholder para Sprint 3 |
| `src/app/events/new/components/Step3Lots.tsx` | Placeholder para Sprint 4 |

---

## 4. Sprint 2 — Formulário da Etapa 1

**Status:** 🔄 Em andamento

### Objetivo
Implementar todos os campos do formulário da Etapa 1 (Informações Básicas) com validações em tempo real, mensagens de erro e controle de estados dos botões.

### O que NÃO está no escopo desta sprint
- Integração com backend/API
- Upload real de arquivos (apenas preview local e validação)
- Editor WYSIWYG para descrição (textarea simples)
- Implementação das Etapas 2 e 3

### Campos do Formulário

| # | Campo | Tipo | Obrigatório | Validações |
|---|-------|------|-------------|------------|
| 1 | Nome da Corrida | `<input type="text">` | Sim | Mín. 5, máx. 120 caracteres |
| 2 | URL do evento | `<input type="text">` com prefixo `runpass.com.br/` | Sim | Slug sanitizado, máx. 80 caracteres |
| 3 | Data do Evento | `<input type="date">` | Sim | Data futura; exibe formato brasileiro (DD/MM/AAAA) |
| 4 | Horário de Largada | `<input type="time">` | Sim | Formato 24h; exibe confirmação |
| 5 | Local | `<input type="text">` | Sim | Máx. 200 caracteres |
| 6 | Banner | `<input type="file">` | Não | Formatos: JPG, PNG, WebP; máx. 5 MB; preview |
| 7 | Descrição | `<textarea>` | Não | Máx. 5000 caracteres com contador |

### Critérios de Aceitação Concluídos

| Item | Descrição | Status |
|------|-----------|--------|
| AC1 | Nome da Corrida com validação | ✅ |
| AC2 | URL com prefixo fixo e sanitização em tempo real | ✅ |
| AC3 | Data com date picker e validação futura | ✅ |
| AC4 | Horário de Largada com time picker | ✅ |
| AC5 | Local com validação | ✅ |
| AC6 | Banner com validação de formato e tamanho | ✅ |
| AC7 | Descrição com contador de caracteres | ✅ |
| AC8 | Mensagens de erro ao lado de cada campo | ✅ |
| AC9 | Botão "Próximo →" desabilitado se campos obrigatórios vazios | ✅ |
| AC10 | Botão "Próximo →" só avança com validação | ✅ |
| AC11 | Slug sanitizado em tempo real | ✅ |
| AC12 | Botão "Salvar rascunho" funcional | ✅ |
| AC13 | Dados persistem entre etapas | ✅ |
| — | Exibição da data no formato brasileiro (DD/MM/AAAA) | ✅ |
| — | Exibição do horário selecionado como confirmação | ✅ |
| — | Correção da função `isStepValid()` que estava quebrada | ✅ |

### Critérios Pendentes

| Item | Descrição | Prioridade |
|------|-----------|------------|
| Pendente | Persistência real do rascunho via chamada de API | Média |
| Pendente | Mensagens de erro mais específicas para cada campo | Baixa |

---

## 5. Arquitetura dos Componentes

### Diagrama de Hierarquia

```
page.tsx (Next.js Page)
└── WizardContainer.tsx (Client Component)
    ├── StepIndicator.tsx (currentStep, totalSteps)
    ├── Step1BasicInfo.tsx (eventData, setEventData) ← Sprint 2
    ├── Step2Courses.tsx (placeholder) ← Sprint 3
    └── Step3Lots.tsx (placeholder) ← Sprint 4
```

### WizardContainer.tsx

**Responsabilidades:**
- Gerenciar o estado `currentStep` (1 a 3)
- Gerenciar o estado `eventData` com todos os 7 campos
- Renderizar o `StepIndicator` e o step ativo via `renderStep()`
- Controlar a navegação com os botões "← Voltar", "← Dashboard" e "Próximo →"
- Escutar o evento customizado `wizard-next` disparado pelo `Step1BasicInfo`

**Interface `EventData`:**

```typescript
export interface EventData {
  name: string;        // Nome da corrida
  url: string;         // Slug da URL
  date: string;        // Data no formato ISO (YYYY-MM-DD)
  time: string;        // Horário no formato HH:MM
  location: string;    // Local do evento
  banner: string;      // URL do preview do banner (object URL)
  description: string; // Descrição do evento
}
```

**Estados de Navegação:**

| Etapa | Botão Esquerdo | Botão Direito | Comportamento |
|-------|----------------|---------------|---------------|
| 1 | ← Dashboard (volta ao histórico) | Próximo → (valida e avança) | Step1 controla validação via evento customizado |
| 2 | ← Voltar (retorna Etapa 1) | Próximo → (avança para Etapa 3) | Navegação direta |
| 3 | ← Voltar (retorna Etapa 2) | — | Nenhum botão direito |

### Step1BasicInfo.tsx

**Responsabilidades:**
- Renderizar e controlar os 7 campos do formulário
- Sanitizar o slug da URL em tempo real
- Validar campos individualmente (onBlur) e em conjunto (onSubmit)
- Gerenciar preview do banner via `URL.createObjectURL()`
- Gerenciar salvamento de rascunho
- Disparar evento `wizard-next` ao navegar com sucesso

**Estados Internos:**

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `errors` | `FieldErrors` | Erros de validação de cada campo |
| `touched` | `Record<string, boolean>` | Campos que já perderam foco |
| `isSaving` | `boolean` | Estado de loading do "Salvar rascunho" |
| `isNextLoading` | `boolean` | Estado de loading do "Próximo →" |
| `lastSavedData` | `string` | JSON string do último salvamento (para detectar alterações) |

---

## 6. Fluxo de Dados

### Ciclo de Vida dos Dados na Etapa 1

```
Usuário digita → handleChange() atualiza eventData → 
  → Se campo com erro: limpa erro do campo
  → Se slug: handleSlugChange() sanitiza automaticamente

Usuário sai do campo (blur) → handleBlur() → validateField() → 
  → Se erro: setErrors() exibe mensagem
  → Se ok: limpa erro

Usuário clica "Próximo →" → handleNext() → validateStep() →
  → Se inválido: setErrors() exibe todos os erros
  → Se válido: dispatchEvent('wizard-next') → WizardContainer avança
```

### Sanitização do Slug

A função `handleSlugChange(value)` aplica as seguintes transformações em tempo real:

1. Converte para **minúsculas**
2. Remove **acentos** (normalização NFD)
3. Remove **caracteres especiais** (mantém letras, números, espaços e hífens)
4. Substitui **espaços por hífens**
5. Remove **hífens duplicados**
6. Remove **hífen no início ou fim**
7. Trunca para **80 caracteres**

### Exibição da Data e Horário

A data é armazenada internamente no formato ISO (`2025-03-20`) para compatibilidade com inputs HTML e APIs. Para exibição ao usuário, é adicionada uma mensagem auxiliar:

- **Data:** `Data selecionada: 20/03/2025` (formato brasileiro via `toLocaleDateString('pt-BR')`)
- **Horário:** `Largada às 07:00` (confirmação do valor selecionado)

---

## 7. Validações e Regras de Negócio

### Validações por Campo

| Campo | Regra | Mensagem de Erro |
|-------|-------|-------------------|
| Nome | Obrigatório, mínimo 5, máximo 120 caracteres | "O nome da corrida é obrigatório." / "O nome deve ter pelo menos 5 caracteres." / "O nome deve ter no máximo 120 caracteres." |
| URL | Obrigatório, apenas letras minúsculas, números e hífens | "A URL do evento é obrigatória." / "A URL deve conter apenas letras, números e hífens." |
| Data | Obrigatório, deve ser futura | "A data do evento é obrigatória." / "A data do evento deve ser futura." |
| Horário | Obrigatório | "O horário de largada é obrigatório." |
| Local | Obrigatório, máximo 200 caracteres | "O local do evento é obrigatório." / "O local deve ter no máximo 200 caracteres." |
| Banner | Formatos: JPG, PNG, WebP; máximo 5 MB | "Formato não suportado. Use JPG, PNG ou WebP." / "O arquivo deve ter no máximo 5 MB." |
| Descrição | Máximo 5000 caracteres | "A descrição deve ter no máximo 5000 caracteres." |

### Validação em Conjunto (validateStep)

Quando o usuário clica em "Próximo →", a função `validateStep()` valida todos os campos obrigatórios (`name`, `url`, `date`, `time`, `location`) e, se preenchida, a descrição. Se algum campo estiver inválido, o formulário não avança e todas as mensagens de erro são exibidas.

### Campo URL — Comportamento Especial

Diferente de muitos sistemas, a URL do evento **não** é gerada automaticamente a partir do nome. O organizador digita o slug desejado manualmente. O sistema apenas sanitiza o que foi digitado (remove caracteres inválidos). O nome e a URL são campos independentes.

---

## 8. Estados dos Componentes

### Botão "Salvar rascunho"

| Estado | Condição | Aparência |
|--------|----------|-----------|
| **Desabilitado** | Sem alterações desde o último salvamento | Cinza, cursor not-allowed |
| **Habilitado** | Houve alterações não salvas | Azul, hover azul escuro |
| **Carregando** | Salvando no momento | Cinza, spinner + "Salvando..." |

### Botão "Próximo →"

| Estado | Condição | Aparência |
|--------|----------|-----------|
| **Desabilitado** | Campos obrigatórios não preenchidos | Cinza, cursor not-allowed |
| **Habilitado** | Todos os campos obrigatórios preenchidos | Azul, hover azul escuro |
| **Carregando** | Validando e navegando | Cinza, spinner + "Avançando..." |

### Campo com Erro

- Borda vermelha (`border-red-500`)
- Mensagem de erro em texto vermelho abaixo do campo (`text-sm text-red-600`)

---

## 9. Histórico de Correções

### Correção 1: Função `isStepValid()` quebrada

**Problema:** A função `isStepValid()` estava incompleta no código. Ela retornava `true` parcial e não tinha o fechamento correto da função, resultando em erro de sintaxe. Além disso, não validava os campos `time` e `location`.

**O que foi feito:**
- Reescreveu a função completa para validar os 5 campos obrigatórios:
  - `name` (não vazio)
  - `url` (não vazio)
  - `date` (não vazio)
  - `time` (não vazio)
  - `location` (não vazio, trim)

**Código corrigido:**
```typescript
const isStepValid = (): boolean => {
  return !!(
    eventData.name.trim() &&
    eventData.url.trim() &&
    eventData.date &&
    eventData.time &&
    eventData.location.trim()
  );
};
```

### Correção 2: Bloco JSX duplicado no WizardContainer

**Problema:** Havia duas linhas idênticas `{currentStep < totalSteps && currentStep > 1 && ()}` no JSX, sendo a primeira um bloco vazio. Isso causava erro de compilação (HTTP 500) na rota `/events/new`.

**O que foi feito:**
- Removeu o bloco vazio duplicado, mantendo apenas o bloco correto com o botão "Próximo →".

---

## 10. Próximos Passos

### Sprint 2 — Pendências

- [ ] Substituir `alert()` e `console.log()` do "Salvar rascunho" por chamada real à API
- [ ] Implementar mensagens de erro mais específicas por campo

### Sprint 3 — Etapa 2: Percursos e Distâncias

- [ ] Implementar `Step2Courses.tsx` com tabela dinâmica de percursos
- [ ] Validações de sobreposição de numeração de peito
- [ ] Modalidades pré-definidas e customizadas
- [ ] Numeração automática vs. manual (faixa)

### Sprint 4 — Etapa 3: Lotes, Vagas e Preços

- [ ] Implementar `Step3Lots.tsx` com configuração de lotes
- [ ] Modos de virada de lote (data, esgotamento, combinado)
- [ ] Validação de vagas por percurso
- [ ] Lotes especiais (PCD, +60)

### Geral

- [ ] Integração com backend NestJS
- [ ] Upload real de arquivos (banner)
- [ ] Portal público do evento
- [ ] Painel do organizador

---

## Referências

| Documento | Descrição |
|-----------|-----------|
| `docs/1-spec.md` | SPEC técnica inicial do projeto |
| `docs/architecture.md` | Arquitetura do sistema |
| `docs/progress.json` | Progresso das sprints (formato JSON) |
| `docs/specs/spec-cadastro-corrida.md` | Especificação detalhada do wizard de cadastro |
| `docs/sprints/sprint-1-estrutura.md` | Planejamento da Sprint 1 |
| `docs/sprints/sprint-2-formularios.md` | Planejamento da Sprint 2 |
| `docs/prototipo-wizard-corrida.html` | Protótipo HTML navegável de todas as etapas |

---

*Documento gerado em 17/07/2025. Última atualização: Sprint 2, correção do isStepValid() e WizardContainer.*