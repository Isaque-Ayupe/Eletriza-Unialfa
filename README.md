# ⚡ Eletriza-Unialfa & EnergiAI (Sistema Fullstack de Otimização Energética)

O **Eletriza-Unialfa** (frontend) em conjunto com o **EnergiAI / AgenteEnergetico** (backend) compõem um sistema inteligente e de alta fidelidade visual voltado para a **otimização de consumo energético em edifícios** (como blocos administrativos, laboratórios de pesquisa, salas de aula e data centers). 

A solução combina um painel administrativo moderno e responsivo com um sistema de orquestração agêntica de IA baseado em **CrewAI** e **Google Gemini** para monitorar a telemetria do campus, identificar desperdícios de energia e aplicar ações corretivas sem degradar o conforto térmico.

---

## 🏗️ Arquitetura do Sistema

O projeto é dividido em duas partes principais que operam de forma integrada:

1.  **Frontend (Eletriza-Unialfa)**: 
    *   Construído com **React 19**, **Vite**, **TypeScript** e estilizado com **Tailwind CSS v4** e **Motion (Framer Motion)**.
    *   Fornece a interface visual de bento-grid brutalista com gráficos de consumo em tempo real, monitoramento de saúde do prédio, status detalhado dos Agentes de IA, gerenciamento completo (CRUD) de ambientes prediais e **geração de anomalias reais** com diagnóstico inteligente por IA.
2.  **Backend (AgenteEnergetico)**:
    *   Construído em **Django 6**, banco de dados **PostgreSQL** e **CrewAI 1.14.x**.
    *   Expõe uma API REST stateless com endpoints para coleta de telemetria, CRUD de zonas, **CRUD de anomalias**, otimização energética via orquestração de múltiplos agentes autônomos e diagnóstico de anomalias via Google Gemini.

```
                    ┌────────────────────────┐
                    │  CLIENTE (FRONTEND)    │
                    │    Eletriza-Unialfa    │
                    │   (React + Vite)       │
                    └───────────┬────────────┘
                                │
                      Requisições HTTP /api
                      (Proxy: Port 5173 ➔ 8000)
                                │
                                ▼
                    ┌────────────────────────┐
                    │   SERVIDOR (BACKEND)   │
                    │    AgenteEnergetico    │
                    │    (Django + REST)     │
                    └───────────┬────────────┘
                                │
                     ┌──────────┴──────────┐
                     ▼                     ▼
             ┌──────────────┐      ┌──────────────┐
             │ Banco de da. │      │   CrewAI +   │
             │  PostgreSQL  │      │ Google Gemini│
             └──────────────┘      └──────────────┘
```

---

## 🤖 Como Funciona a Inteligência do Sistema

### Orquestração de Agentes (CrewAI)

Quando o frontend ou um sensor de automação solicita a otimização de um ambiente predial, o backend Django aciona uma Crew (equipe de agentes) que executa o seguinte fluxo sequencial:

1.  **Energy Optimizer Specialist**: Lê a telemetria atual da zona e usa ferramentas matemáticas determinísticas (*skills*) para prever o consumo, avaliar o conforto térmico e sugerir novos setpoints.
2.  **Energy Control Operations Judge**: Valida a recomendação contra regras de segurança predial e conforto humano, tomando a decisão final (`execute`, `hold` ou `override`).

### Geração de Anomalias Reais

O sistema permite gerar **anomalias reais** que alteram efetivamente os dados de telemetria das zonas:

| Tipo de Anomalia | Efeito Real na Zona |
|------------------|---------------------|
| Sobrecarga de HVAC - Temperatura Crítica | Temperatura +4~8°C, consumo +40~80kW, umidade +5~15% |
| Surto de Consumo Elétrico | Consumo +60~120kW, temperatura +1~3°C |
| Falha de Sensor Térmico | Temperatura exibida como 99.9°C ou -1.0°C |
| Luzes Ativas Fora de Horário | Consumo +15~30kW, ocupação reduzida drasticamente |
| Pico de Umidade em Sala de Servidores | Umidade +25~40%, consumo +10~25kW |
| Fator de Potência Crítico nos Transformadores | Consumo +50~100kW, temperatura +2~5°C |

Cada anomalia:
- **Salva um snapshot antes/depois** da zona para possibilitar restauração
- **É registrada no banco de dados** com diagnóstico completo
- **Gera um alerta real** (não simulado) no sistema
- **Recebe diagnóstico inteligente** via Google Gemini quando a API key está configurada
- **Pode ser resolvida via API**, restaurando automaticamente os valores da zona

### 🛠️ Skills (Ferramentas de Cálculo) do Otimizador

*   **Forecast Skill**: Previsão de consumo para a próxima hora baseada no histórico de 24h.
*   **Comfort Skill**: Score de conforto térmico predial (0 a 100) e limites aceitáveis.
*   **Optimizer Skill**: Recomendação de setpoint e economia com base nos dados.
*   **Simulation Skill**: Projeção de economia financeira e avaliação de risco térmico.

---

## 📁 Estrutura dos Projetos

### 1. Frontend (`Eletriza-Unialfa/`)

```
Eletriza-Unialfa/
├── src/
│   ├── components/
│   │   ├── DashboardView.tsx     # Gráficos, métricas principais e logs de anomalias reais
│   │   ├── EnvironmentsView.tsx  # CRUD de ambientes prediais e alertas individuais
│   │   ├── AgentsView.tsx        # Gerenciamento de diretrizes dos agentes de IA
│   │   ├── ReportsView.tsx       # Visualização e download de relatórios do sistema
│   │   ├── SettingsView.tsx      # Configurações de tema (claro/escuro) e perfil
│   │   └── SimulationModal.tsx   # Gerador de anomalias reais com diagnóstico IA
│   ├── types.ts                  # Tipos TypeScript: Zone, Agent, Alert, Report, Anomaly
│   ├── index.css                 # Folha de estilos e configurações globais (Tailwind v4)
│   ├── main.tsx                  # Ponto de entrada do React
│   └── App.tsx                   # Layout global, abas, integração de requisições e toast
├── vite.config.ts                # Configuração do Vite com proxy integrado para porta 8000
└── package.json                  # Dependências (React 19, Motion, Lucide, Tailwind v4)
```

### 2. Backend (`AgenteEnergetico/`)

```
AgenteEnergetico/
└── energy_agent/
    ├── manage.py                 # CLI de gerenciamento do Django
    ├── core/                     # Configurações do projeto e db_init.py para criação do banco
    ├── api/                      # Views, models, rotas da API REST
    │   ├── models.py             # Zone, Agent, AgentControl, Alert, Report, Anomaly
    │   ├── views.py              # Endpoints: telemetria, CRUD zonas, anomalias, simulação, otimização
    │   ├── urls.py               # Todas as rotas REST da aplicação
    │   └── migrations/           # Migrações do banco de dados
    ├── crew/                     # Orquestração do CrewAI (agentes, tarefas e ferramentas)
    ├── schemas/                  # Schemas Pydantic de entrada e saída
    ├── skills/                   # Módulos matemáticos puros para análise e previsão
    ├── actions/                  # JSONs de decisões salvas pelo agente Juiz
    └── requirements.txt          # Dependências Python (Django, CrewAI, Psycopg2, etc.)
```

---

## 🔌 API REST — Endpoints Disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Health check do servidor |
| `GET` | `/api/telemetry` | Dados completos: zonas, agentes, alertas, relatórios e stats |
| `POST` | `/api/zones` | Criar nova zona de monitoramento |
| `PUT` | `/api/zones/<zone_id>` | Atualizar zona existente |
| `DELETE` | `/api/zones/<zone_id>` | Remover zona |
| `POST` | `/api/agents/toggle` | Alternar controles dos agentes de IA |
| `POST` | `/api/error-simulation` | **Gerar anomalia real** com alterações de telemetria |
| `GET` | `/api/anomalies` | Listar todas as anomalias (filtro: `?status=active`) |
| `GET` | `/api/anomalies/<id>` | Detalhes de anomalia específica |
| `PUT` | `/api/anomalies/<id>` | Atualizar anomalia (status/notas). `resolved` restaura a zona |
| `DELETE` | `/api/anomalies/<id>` | Remover registro de anomalia |
| `POST` | `/api/optimize/` | Otimização energética via CrewAI |
| `POST` | `/api/agents` | Criar novo agente |
| `POST` | `/api/alerts` | Criar alerta manualmente |
| `POST` | `/api/reports` | Criar relatório |

---

## 🚀 Como Fazer Funcionar Localmente

Para rodar a aplicação completa na sua máquina local, siga os passos abaixo.

### Passo 1: Configurar e Executar o Backend (`AgenteEnergetico`)

#### Pré-requisitos
*   **Python 3.13** instalado (evite 3.14+ devido a instabilidades em binários do Pydantic).
*   **PostgreSQL** (versão 14 ou superior) rodando localmente ou remotamente.
*   Chave de API do **Google Gemini** (`GEMINI_API_KEY`).

#### 1. Instalar as dependências

Abra o terminal na pasta raiz do projeto backend `AgenteEnergetico`:

Se você utiliza o gerenciador de pacotes **`uv`** (altamente recomendado):
```bash
# Criar ambiente virtual com Python 3.13
uv venv .venv --python 3.13
# Ativar o ambiente virtual (Windows PowerShell)
.\.venv\Scripts\Activate.ps1
# Instalar dependências
uv pip install -r energy_agent/requirements.txt
```

Utilizando o **`pip`** padrão:
```bash
# Criar o ambiente virtual
python -m venv .venv
# Ativar o ambiente virtual (Windows PowerShell)
.\.venv\Scripts\Activate.ps1
# Em Linux/MacOS: source .venv/bin/activate

# Instalar dependências
pip install -r energy_agent/requirements.txt
```

#### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `energy_agent/` (ou copie do `.env.example`):
```bash
cp energy_agent/.env.example energy_agent/.env
```

Abra o arquivo `energy_agent/.env` e configure:
*   `DJANGO_SECRET_KEY`: Gere uma chave segura (Ex: `python -c "import secrets; print(secrets.token_urlsafe(50))"`).
*   `GEMINI_API_KEY`: Sua chave de API obtida no [Google AI Studio](https://aistudio.google.com/).
*   `DB_NAME`: Nome do banco de dados (padrão: `energy_agent_db`).
*   `DB_USER`: Usuário do PostgreSQL (padrão: `postgres`).
*   `DB_PASSWORD`: Senha do seu usuário do PostgreSQL.
*   `DB_HOST`: Host do banco (padrão: `localhost`).
*   `DB_PORT`: Porta do banco (padrão: `5432`).

#### 3. Inicializar o Banco de Dados e Rodar Migrações

Com o PostgreSQL rodando localmente, execute:
```bash
# Cria o banco de dados caso não exista
python energy_agent/core/db_init.py

# Aplica as migrações estruturais do Django (cria tabelas de zonas, agentes, alertas, anomalias, etc.)
python energy_agent/manage.py migrate
```

#### 4. Executar o Servidor do Backend

Inicie o servidor de desenvolvimento do Django na porta **8000**:
```bash
python energy_agent/manage.py runserver
```
*O servidor estará acessível localmente em `http://localhost:8000/`.*

---

### Passo 2: Configurar e Executar o Frontend (`Eletriza-Unialfa`)

#### Pré-requisitos
*   **Node.js** (versão 18 ou superior) instalado.

#### 1. Instalar as dependências

Abra outro terminal na pasta raiz do projeto frontend `Eletriza-Unialfa`:
```bash
npm install
```

#### 2. Executar o Servidor de Desenvolvimento

Inicie o Vite para servir a interface visual:
```bash
npm run dev
```
*A interface será iniciada na porta padrão **5173** e estará acessível em `http://localhost:5173/`.*

> [!NOTE]
> Graças ao proxy configurado em `vite.config.ts`, todas as chamadas feitas pelo frontend para `/api/*` serão automaticamente repassadas para o backend Django rodando em `http://localhost:8000/api/*`, evitando erros de CORS e facilitando o desenvolvimento local.

---

## ⚡ Testando Recursos no Painel

Ao acessar o painel (`http://localhost:5173`), você poderá testar:

1.  **Sincronização de Telemetria**: O painel já inicia pré-populado graças a um auto-seeder automático que roda no backend no primeiro acesso.

2.  **Geração de Anomalias Reais**: 
    *   Clique em **"Simular Anomalia"** na sidebar (desktop) ou no header (mobile).
    *   Selecione o tipo de anomalia, a zona alvo e a gravidade.
    *   Ao gerar, os dados de telemetria da zona são **realmente alterados** (temperatura, umidade, consumo) — não são dados mockados.
    *   O diagnóstico é gerado pela **IA Gemini** em tempo real quando a API key está configurada, ou por lógica determinística de fallback.
    *   Após concluir, você pode gerar outra anomalia clicando em **"Nova Anomalia"** sem precisar fechar o modal.
    *   O alerta real aparece imediatamente no painel de **Anomalias de Telemetria / Alertas Ativos**.

3.  **CRUD de Anomalias (via API)**:
    *   `GET /api/anomalies` — lista todas as anomalias com snapshot antes/depois
    *   `PUT /api/anomalies/<id>` com `{"status": "resolved"}` — resolve a anomalia e **restaura a zona ao estado anterior**
    *   `DELETE /api/anomalies/<id>` — remove o registro

4.  **Ambientes Prediais (CRUD)**: Crie novos espaços de monitoramento (como salas de aula e escritórios), edite setpoints e remova zonas. Os dados são atualizados em tempo real no banco PostgreSQL.

5.  **Agentes IA**: Habilite ou desabilite controles individuais dos agentes de regulação de gastos e resiliência de rede. As métricas são recalculadas automaticamente.

6.  **Otimização Inteligente**: Dispare otimizações completas via CrewAI que envolvem previsão de consumo, análise de conforto térmico e decisões automatizadas com justificativa.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
*   **React 19**: Biblioteca principal de UI com hooks e componentes funcionais.
*   **Vite 6**: Bundler e dev server com proxy integrado para o backend.
*   **TypeScript 5.8**: Tipagem estática para todos os componentes e tipos da API.
*   **Tailwind CSS v4**: Framework de estilos utilitários (via plugin Vite).
*   **Motion (Framer Motion)**: Animações e transições fluidas.
*   **Lucide React**: Biblioteca de ícones consistente e leve.

### Backend
*   **Django 6.0.5**: Framework backend Python para rotas HTTP, ORM e migrações.
*   **PostgreSQL**: Banco de dados relacional para persistência completa.
*   **CrewAI 1.14.x**: Orquestrador agêntico para fluxo sequencial de raciocínio.
*   **Google Gemini (gemini-2.5-flash)**: LLM para diagnósticos inteligentes e otimização energética.
*   **python-dotenv**: Carregamento seguro de variáveis de ambiente.
*   **django-cors-headers**: Controle de CORS para desenvolvimento local.
