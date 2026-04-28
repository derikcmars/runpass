# Arquitetura do Runpass (architecture.md)

## 1. Visão Geral
Runpass é uma plataforma SaaS B2B multi-tenant para gestão completa de corridas de rua. A arquitetura segue um modelo de API monolítica que serve um frontend estático, com isolamento de dados dos organizadores garantido pela aplicação e pelo banco de dados.

## 2. Stack Tecnológica (Versão Aprovada para MVP)

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Linguagem** | TypeScript | Tipagem estática obrigatória para segurança e produtividade. |
| **Backend** | NestJS + Node.js | Framework modular, opinionado e com suporte nativo a Swagger. |
| **ORM** | Prisma | Tipagem forte, migrations simplificadas e excelente DX. |
| **Banco** | PostgreSQL 16 | Isolamento multi-tenant, performance e confiabilidade. |
| **Cache MVP** | Cache em memória | Gerenciado pelo NestJS/Cache-Manager. Sem infraestrutura externa no início. |
| **Filas MVP** | PG-Boss | Gerenciamento de tarefas assíncronas usando o próprio PostgreSQL. |
| **Autenticação** | JWT (access + refresh) e Magic Link | Access token (15min), Refresh token (7d, httpOnly). Staff autentica via link temporário. |
| **Pagamentos** | Asaas | Split automático de pagamentos entre organizador e plataforma. |
| **Email** | Amazon SES | Envios transacionais (confirmação, recibos) com custo baixíssimo. |
| **Armazenamento** | DigitalOcean Spaces (S3-compatible) | Para banners, logos e documentos de atletas. |
| **Infra/Deploy** | DigitalOcean App Platform | Deploy direto do GitHub, com PostgreSQL gerenciado e HTTPS automático. |

## 3. Modelagem Multi-Tenant
- **Estratégia**: Isolamento em nível de aplicação (schema compartilhado).
- **Mecanismo**: Coluna `organization_id` em todas as tabelas de dados transacionais.
- **Segurança**: Um `TenantMiddleware` no NestJS injeta o `organizationId` extraído do JWT no contexto da requisição. O `PrismaService` utiliza este valor para filtrar automaticamente todas as queries.

### 3.1 Camada Extra de Segurança: Row-Level Security (RLS)
Como defesa em profundidade, as tabelas que contêm dados dos tenants terão políticas de Row-Level Security (RLS) ativadas no PostgreSQL. Mesmo que uma query seja executada sem o filtro `WHERE organization_id`, o próprio banco de dados impede o acesso a dados de outros tenants. A implementação será feita no momento da primeira migração, com políticas como:
`CREATE POLICY tenant_isolation ON events FOR ALL USING (organization_id = current_setting('app.current_tenant_id')::uuid);`

## 4. Estratégia de Segurança
- **Autenticação**: JWT assinado com `RS256`. Senhas hasheadas com `bcrypt` (cost=12).
- **Autorização**: Middleware extrai `organizationId` do token e o injeta no contexto.
- **Validação**: `class-validator` e `class-transformer` em todos os DTOs de entrada.
- **Proteção de Rotas**: Rate limiting com `@nestjs/throttler`. CORS e headers de segurança com `helmet`.
- **Segurança de Dados**: Nenhum dado sensível em logs. Queries parametrizadas (Prisma).

## 5. Resiliência do Gateway de Pagamento (Asaas)
Para garantir que nenhum pagamento seja perdido e que a experiência de checkout seja robusta, as integrações com o Asaas seguem três princípios:
- **Filas para Processamento**: Ao receber um webhook do Asaas, a API apenas valida a assinatura e publica a mensagem no PG-Boss. Um worker processa a confirmação de forma assíncrona.
- **Retry com Backoff Exponencial**: Se uma chamada à API do Asaas falhar (ex: timeout, erro 5xx), o PG-Boss agenda novas tentativas com intervalos crescentes (1s, 2s, 4s, 8s...).
- **Idempotência**: Toda operação de pagamento possui uma chave única (`idempotency_key`). Processar o mesmo webhook duas vezes não gera cobrança duplicada.

## 6. APIs e Comunicação
- **Padrão**: REST com respostas JSON.
- **Versionamento**: `/api/v1/`.
- **Documentação**: Swagger obrigatório em todos os endpoints.
- **Eventos Assíncronos**: PG-Boss gerencia todas as tarefas em segundo plano (emails, notificações, webhooks).

## 7. Pipeline de CI/CD
- **Ferramenta**: GitHub Actions.
- **Gatilho**: Push e Pull Requests para `main` e `develop`.
- **Estágios**: Lint (ESLint), Type Check (`tsc --noEmit`), Testes (Jest) e Build.