# SPEC Técnica: runpass v1.0

## Visão Geral
Plataforma SaaS B2B multi-tenant para gestão completa de corridas de rua. Organizadores cadastram eventos, gerenciam inscrições, percursos, lotes e pagamentos.

## Escopo do MVP
1. **Cadastro de Corrida (Wizard)**: Fluxo completo de criação de evento com 8 etapas.
2. **Portal Público do Evento**: Página pública do evento com informações e inscrição de atletas.
3. **Painel do Organizador**: Dashboard com gerenciamento de inscrições e relatórios.

## Fora do Escopo
- App mobile nativo
- Internacionalização (i18n)
- Marketplace de eventos

## Stack Tecnológica
- Frontend: Next.js 16 + Tailwind CSS 4 + TypeScript
- Backend: NestJS + Node.js
- Banco: PostgreSQL 16 + Prisma

---

## Sprint 1: Estrutura do Wizard + Navegação entre Etapas ✅ (COMPLETO)

### Feature
Esqueleto do wizard de cadastro de corrida com navegação entre 3 etapas e persistência de estado.

### Critérios de Aceitação
- [x] AC1: Acessar a rota `/events/new` renderiza o wizard
- [x] AC2: O wizard exibe o título "Etapa 1 de 3: Informações Básicas" ao carregar
- [x] AC3: Um indicador de progresso visual ("Etapa X de 3") está visível no topo
- [x] AC4: Um botão "Próximo →" leva para a Etapa 2
- [x] AC5: A Etapa 2 exibe o título "Etapa 2 de 3: Percursos e Distâncias"
- [x] AC6: Um botão "← Voltar" na Etapa 2 retorna para a Etapa 1
- [x] AC7: O botão "Próximo" na Etapa 2 leva para a Etapa 3
- [x] AC8: A Etapa 3 exibe placeholder "Etapa 3: Lotes, Vagas e Preços"
- [x] AC9: O botão "Próximo" fica oculto na Etapa 3 (última etapa)
- [x] AC10: `WizardContainer` mantém `eventData` que persiste ao trocar de etapa
- [x] AC11: `eventData` começa com campos vazios para as 7 informações da Etapa 1
- [x] AC12: Ao navegar para Etapa 2 e voltar, os dados da Etapa 1 permanecem

### Modelo de Dados (Frontend)
- Interface `EventData`:
  - `name`: string
  - `url`: string
  - `date`: string
  - `time`: string
  - `location`: string
  - `banner`: string
  - `description`: string