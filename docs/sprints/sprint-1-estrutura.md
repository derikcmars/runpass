# Sprint 1: Estrutura do Wizard + Navegação entre Etapas

## Objetivo
Criar o esqueleto do wizard de cadastro de corrida com Next.js (App Router). Esta sprint trata apenas da navegação entre etapas e da estrutura vazia. Nenhum campo de formulário ou validação será implementado agora.

## O que NÃO faremos nesta sprint
- Campos de formulário (nome, data, etc.)
- Validações
- Backend / API
- Qualquer estilo visual avançado

---

## Critérios de Aceitação

### Estrutura Básica
- [ ] AC1: Acessar a rota `/events/new` renderiza o wizard
- [ ] AC2: O wizard exibe o título "Etapa 1 de 3: Informações Básicas" ao carregar
- [ ] AC3: Um indicador de progresso visual (ex: "Etapa 1 de 3") está visível no topo

### Navegação
- [ ] AC4: Um botão "Próximo →" leva para a Etapa 2
- [ ] AC5: A Etapa 2 exibe o título "Etapa 2 de 3: Percursos e Distâncias"
- [ ] AC6: Um botão "← Voltar" na Etapa 2 retorna para a Etapa 1
- [ ] AC7: O botão "Próximo" na Etapa 2 leva para a Etapa 3
- [ ] AC8: A Etapa 3 exibe um placeholder (texto temporário) "Etapa 3: Lotes, Vagas e Preços"
- [ ] AC9: O botão "Próximo" fica oculto ou desabilitado na Etapa 3 (última etapa)

### Persistência de Dados entre Etapas
- [ ] AC10: O componente pai do wizard mantém um objeto de estado chamado `eventData` que persiste ao trocar de etapa
- [ ] AC11: `eventData` começa com campos vazios para as 7 informações da Etapa 1 (nome, url, data, horario, local, banner, descricao)
- [ ] AC12: Ao navegar para a Etapa 2 e voltar, os dados preenchidos na Etapa 1 permanecem (teste mental: console.log do `eventData` ao clicar em "Voltar")

---

## Informações Técnicas

### Stack
- Next.js 14+ (App Router)
- TypeScript
- Estilização: CSS Modules ou Tailwind (escolha o mais simples para MVP)

### Estrutura de Arquivos Esperada
src/app/events/new/
├── page.tsx              (ponto de entrada do wizard)
├── components/
│   ├── WizardContainer.tsx   (gerencia estado e etapas)
│   ├── StepIndicator.tsx     (mostra "Etapa X de 3")
│   ├── Step1BasicInfo.tsx    (placeholder Etapa 1)
│   ├── Step2Courses.tsx      (placeholder Etapa 2)
│   └── Step3Lots.tsx         (placeholder Etapa 3)