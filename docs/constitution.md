s
# Constituição do Projeto Runpass (constitution.md)

## 1. Propósito
Este documento estabelece os princípios imutáveis de qualidade, segurança, design e colaboração que regem o desenvolvimento da plataforma Runpass. Toda contribuição, revisão de código e decisão técnica deve estar em conformidade com estas diretrizes.

## 2. Princípios de Código Limpo (Clean Code)

### 2.1 Fundamentos
- **SOLID**: Os cinco princípios (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) serão aplicados rigorosamente em todo o backend.
- **DRY (Don't Repeat Yourself)**: Nenhuma lógica de negócio, regra de validação ou formatação será duplicada.
- **KISS (Keep It Simple, Stupid)**: A abordagem mais simples é sempre a preferida. Soluções complexas exigem justificativa documentada.
- **YAGNI (You Ain't Gonna Need It)**: Funcionalidades não serão implementadas antes do momento necessário.

### 2.2 Padrões de Escrita
- **Nomes**: Descritivos e que revelem intenção (ex: `calcularDescontoLote`). Abreviações são proibidas, exceto `id`, `url`, `api`.
- **Funções/Métodos**: Máximo de 20 linhas. Devem fazer apenas uma coisa.
- **Comentários**: Devem explicar o "porquê", nunca "o quê". O código bem escrito é autoexplicativo.
- **Formatação**: Automatizada via Prettier, com regras de qualidade de código garantidas pelo ESLint (configuração padrão do NestJS). Sem discussões manuais.

## 3. Nomenclatura e Padrões de Projeto
- **CSS**: Metodologia BEM (Block__Element--Modifier). Design system documentado com variáveis.
- **TypeScript**: `camelCase` para funções e variáveis, `PascalCase` para classes e interfaces.
- **Banco de Dados**: Tabelas e colunas em `snake_case`. Nomes de tabelas no plural.
- **API REST**: Endpoints no plural (`/api/v1/events`). Respostas padronizadas (sucesso e erro). Versionamento na URL (`/v1/`).
- **Git**: Conventional Commits (`feat:`, `fix:`, `docs:`). Branches: `main` (produção), `develop` (integração), `feat/*`, `fix/*`.

## 4. Documentação e Comentários
- **JSDoc**: Todas as funções e classes públicas devem ser documentadas.
- **README.md**: Deve conter instruções de setup, contribuição e deploy.
- **Arquitetura**: O arquivo `architecture.md` é a fonte da verdade técnica.

## 5. Infraestrutura de Segurança
- **Autenticação e Autorização**: JWT com access token (15 min) e refresh token (7 dias). Todas as senhas hasheadas com bcrypt (cost=12).
- **OWASP e Validação**: Rate limiting em endpoints públicos e de autenticação. CORS configurado para origens estritamente permitidas. Headers de segurança (Helmet) obrigatórios (HSTS, CSP).
- **Dados e Logs**: Queries parametrizadas (Prisma). Nenhum dado sensível em logs.

## 6. Qualidade e Cobertura de Testes
- **Cobertura Mínima**: 80% para lógica de negócio; 100% para autenticação e pagamentos.
- **Tipos de Teste**: Unitários, de Integração (API + BD) e End-to-End (fluxos críticos).
- **Pipeline CI**: Lint, verificação de tipos e suíte de testes são executados automaticamente.

## 7. Design e Internacionalização
- **Design e Acessibilidade**: Páginas públicas otimizadas para mobile-first. Cumprir diretrizes WCAG 2.1 AA (contraste, navegação por teclado, labels).
- **Gestão de Estado**: Código preparado para futura internacionalização (i18n), evitando strings hardcoded.