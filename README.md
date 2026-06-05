# ⚡ Eletriza-Unialfa & EnergiAI (Sistema Fullstack de Otimização Energética)

O **Eletriza-Unialfa** (frontend) em conjunto com o **EnergiAI / AgenteEnergetico** (backend) compõem um sistema inteligente e de alta fidelidade visual voltado para a **otimização de consumo energético em edifícios** (como blocos administrativos, laboratórios de pesquisa, salas de aula e data centers). 

A solução combina um painel administrativo moderno e responsivo com um sistema de orquestração agêntica de IA baseado em **CrewAI** e **Google Gemini** para monitorar a telemetria do campus, identificar desperdícios de energia e aplicar ações corretivas sem degradar o conforto térmico.

---

## 🏗️ Arquitetura do Sistema

O projeto é dividido em duas partes principais que operam de forma integrada:

1.  **Frontend (Eletriza-Unialfa)**: 
    *   Construído com **React 19**, **Vite**, **TypeScript** e estilizado com **Tailwind CSS v4** e **Framer Motion**.
    *   Fornece a interface visual de bento-grid brutalista com gráficos de consumo em tempo real, monitoramento de saúde do prédio, status detalhado dos Agentes de IA, gerenciamento completo (CRUD) de ambientes prediais e simulação interativa de anomalias/falhas de sistema.
2.  **Backend (AgenteEnergetico)**:
    *   Construído em **Django 6**, banco de dados **PostgreSQL** e **CrewAI 1.14.x**.
    *   Expõe uma API REST stateless com endpoints para coleta de telemetria, CRUD de zonas e otimização energética através de orquestração de múltiplos agentes autônomos.

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

## 🤖 Como Funciona a Inteligência do Sistema (CrewAI)

Quando o frontend ou um sensor de automação solicita a otimização de um ambiente predial, o backend Django aciona uma Crew (equipe de agentes) que executa o seguinte fluxo de trabalho sequencial:

1.  **Energy Optimizer Specialist**:
    *   Lê a telemetria atual da zona (temperatura interna, umidade, ocupação, carga de iluminação e condicionamento de ar).
    *   Usa ferramentas matemáticas determinísticas (*skills*) em Python para prever o consumo, avaliar o conforto térmico e sugerir novos setpoints de temperatura.
2.  **Energy Control Operations Judge**:
    *   Recebe a recomendação estruturada pelo otimizador.
    *   Valida contra regras críticas de segurança predial e conforto humano.
    *   Toma a decisão final de operação (`execute`, `hold` ou `override`), salvando a decisão estruturada em JSON na pasta `actions/` e retornando a resposta para o cliente.

### 🛠️ Skills (Ferramentas de Cálculo) do Otimizador
*   **Forecast Skill**: Previsão de consumo para a próxima hora baseada no histórico de 24 horas, sazonalidade externa e cronograma acadêmico.
*   **Comfort Skill**: Cálculo do score de conforto térmico predial (0 a 100) e limites aceitáveis de desvios.
*   **Optimizer Skill**: Recomendação de setpoint de temperatura e economia com base nos dados.
*   **Simulation Skill**: Projeção de economia financeira e avaliação de risco de degradação térmica futura.

---

## 📁 Estrutura dos Projetos

### 1. Frontend (`Eletriza-Unialfa/`)
```
Eletriza-Unialfa/
├── src/
│   ├── components/
│   │   ├── DashboardView.tsx     # Gráficos, métricas principais e logs de anomalias
│   │   ├── EnvironmentsView.tsx  # CRUD de ambientes prediais e alertas individuais
│   │   ├── AgentsView.tsx        # Gerenciamento de diretrizes dos agentes de IA
│   │   ├── ReportsView.tsx       # Visualização e download de relatórios do sistema
│   │   ├── SettingsView.tsx      # Configurações de tema (claro/escuro) e perfil
│   │   └── SimulationModal.tsx   # Painel interativo para simular anomalias físicas
│   ├── types.ts                  # Definições de tipos TypeScript compartilhados
│   ├── index.css                 # Folha de estilos e configurações globais
│   ├── main.tsx                  # Ponto de entrada do React
│   └── App.tsx                   # Layout global, abas e integração de requisições
├── vite.config.ts                # Configuração do Vite com proxy integrado para a porta 8000
└── package.json                  # Dependências (React 19, Motion, Lucide, Tailwind v4)
```

### 2. Backend (`AgenteEnergetico/`)
```
AgenteEnergetico/
└── energy_agent/
    ├── manage.py                 # CLI de gerenciamento do Django
    ├── core/                     # Configurações do projeto e db_init.py para criação do banco
    ├── api/                      # Views, models, rotas e serializadores da API REST
    ├── crew/                     # Orquestração do CrewAI (agentes, tarefas e ferramentas)
    ├── skills/                   # Módulos matemáticos puros para análise e previsão
    ├── actions/                  # JSONs de decisões salvas pelo agente Juiz
    └── requirements.txt          # Dependências Python (Django, CrewAI, Psycopg2, etc.)
```

---

## 🚀 Como Fazer Funcionar Localmente

Para rodar a aplicação completa na sua máquina local, siga os passos abaixo para configurar o backend e, em seguida, o frontend.

### Passo 1: Configurar e Executar o Backend (`AgenteEnergetico`)

#### Pré-requisitos
*   **Python 3.13** instalado (evite versões superiores como 3.14 devido a instabilidades em binários do Pydantic).
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
Crie um arquivo `.env` dentro da pasta `energy_agent/` (ou copie do arquivo `.env.example`):
```bash
cp energy_agent/.env.example energy_agent/.env
```

Abra o arquivo `energy_agent/.env` e configure:
*   `DJANGO_SECRET_KEY`: Gere uma chave segura (Ex: `python -c "import secrets; print(secrets.token_urlsafe(50))"`).
*   `GEMINI_API_KEY`: Sua chave de API obtida no Google AI Studio.
*   `DB_NAME`: Nome do banco de dados (padrão: `energy_agent_db`).
*   `DB_USER`: Usuário do PostgreSQL (padrão: `postgres`).
*   `DB_PASSWORD`: Senha do seu usuário do PostgreSQL.
*   `DB_HOST`: Host do banco (padrão: `localhost`).
*   `DB_PORT`: Porta do banco (padrão: `5432`).

#### 3. Inicializar o Banco de Dados e Rodar Migrações
Com o PostgreSQL rodando localmente, execute o utilitário de criação de banco e aplique as tabelas:
```bash
# Cria o banco de dados caso não exista
python energy_agent/core/db_init.py

# Aplica as migrações estruturais do Django
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
2.  **Otimização Inteligente**: Vá na aba **Agentes IA** ou use o botão **Simular Anomalia** para disparar eventos. O frontend notificará na tela a resposta imediata estruturada retornada pela inteligência artificial do Gemini.
3.  **Ambientes Prediais (CRUD)**: Crie novos espaços de monitoramento (como salas de aula e escritórios), edite setpoints e remova zonas ineficientes. Os dados serão atualizados em tempo real no banco PostgreSQL do backend.
