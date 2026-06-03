# Plataforma Global de Gestão de Direitos Autorais (ISWC & CWR)

Plataforma integrada de catalogação musical, divisões de cotas de direitos autorais (*split sheets*) e compliance com o ecossistema CISAC (CWR/ISWC). Este repositório adota uma arquitetura monorepo desacoplada com **Java / Spring Boot** no Backend e **JavaScript / React (Vite)** no Frontend, conectado a uma base de dados relacional **PostgreSQL**.

---

## 🏗️ Arquitetura de Software

O ecossistema é projetado de forma desacoplada com uma API REST Stateless protegida por tokens JWT e um cliente SPA altamente interativo.

```mermaid
graph TD
    subgraph Client ["Camada Cliente (Frontend - React)"]
        React["React SPA (Vite)"]
        CSS["Vanilla CSS (Glassmorphism & Dark Mode)"]
        State["Validação de Splits em Tempo Real"]
    end

    subgraph API ["Camada de Serviços (Backend - Spring Boot)"]
        SpringSecurity["Spring Security (CORS / Stateless)"]
        JWTFilter["Filtro de Autenticação JWT"]
        AuthController["AuthController (/api/auth/login)"]
        WorksController["MusicalWorkController (/api/works)"]
        HoldersController["RightsholderController (/api/rightsholders)"]
        JPA["Spring Data JPA (Camada Repositório)"]
    end

    subgraph Data ["Camada de Dados (PostgreSQL)"]
        DB[("PostgreSQL (iswcdb)")]
    end

    React -->|Requisição HTTP JSON| SpringSecurity
    SpringSecurity --> JWTFilter
    JWTFilter --> AuthController
    JWTFilter --> WorksController
    JWTFilter --> HoldersController
    
    AuthController --> JPA
    WorksController --> JPA
    HoldersController --> JPA
    
    JPA -->|JDBC / Hibernate driver| DB
```

---

## 🗄️ Modelagem e Esquema do Banco de Dados (ERD)

O banco de dados relacional foi modelado de forma a garantir a integridade referencial dos metadados de domínio (ISWC, ISRC, IPI, ISNI) exigidos pelas sociedades arrecadadoras de direitos (como o ECAD e a CISAC).

```mermaid
erDiagram
    RIGHTSHOLDERS {
        uuid id PK
        varchar ipi_name_number "11 dígitos - CISAC"
        varchar isni "16 caracteres - ISNI"
        varchar full_name "Nome Completo"
        varchar email "Contato Único"
        timestamptz created_at
        timestamptz updated_at
    }
    
    MUSICAL_WORKS {
        uuid id PK
        varchar iswc "Formato T9000000000"
        varchar title "Título da Obra"
        varchar language_code "ISO 639-1 (2 chars)"
        varchar musical_genre "CISAC (3 chars)"
        varchar status "ACTIVE / CONFLICT / DRAFT"
        timestamptz created_at
        timestamptz updated_at
    }
    
    RECORDINGS {
        uuid id PK
        varchar isrc "Formato 12 caracteres"
        uuid work_id FK "Vínculo com a Obra"
        varchar title "Título da Gravação"
        integer duration_seconds "Duração (> 0)"
        timestamptz created_at
        timestamptz updated_at
    }
    
    WORK_RIGHTSHOLDERS {
        uuid id PK
        uuid work_id FK "Obra Associada"
        uuid rightsholder_id FK "Autor/Editora Associado"
        varchar role "Papel (CA, AR, E)"
        numeric mechanical_split "Divisão Mecânica (0-100%)"
        numeric performance_split "Divisão Execução (0-100%)"
        numeric publisher_split "Divisão Editora (0-100%)"
        timestamptz created_at
        timestamptz updated_at
    }
    
    CWR_REGISTRATIONS {
        uuid id PK
        varchar filename "Nome do Arquivo CWR"
        varchar status "SUBMITTED / ACCEPTED / REJECTED / ACK_RECEIVED"
        text cwr_content "Conteúdo Flat File CWR"
        timestamptz created_at
        timestamptz updated_at
    }
    
    CWR_TRANSACTION_LOGS {
        uuid id PK
        uuid registration_id FK "Registro CWR Vinculado"
        uuid work_id FK "Obra Referenciada"
        varchar transaction_type "Tipo de Registro (NWR, REV)"
        varchar status_code "Código de Retorno ACK"
        text raw_log "Histórico bruto do ACK"
        timestamptz created_at
    }

    RIGHTSHOLDERS ||--o{ WORK_RIGHTSHOLDERS : "possui cotas de"
    MUSICAL_WORKS ||--o{ WORK_RIGHTSHOLDERS : "distribuído em"
    MUSICAL_WORKS ||--o{ RECORDINGS : "gravado como"
    CWR_REGISTRATIONS ||--o{ CWR_TRANSACTION_LOGS : "gera logs de"
    MUSICAL_WORKS ||--o{ CWR_TRANSACTION_LOGS : "referencia no log"
```

---

## 🛠️ Configuração e Execução do Repositório

### Requisitos Prévios
- **Java JDK 23** ou superior
- **Apache Maven 3.9** ou superior
- **Node.js v23** e **npm 11** ou superior
- Instância do **PostgreSQL** rodando no endereço configurado (`192.168.1.107:5432` / Banco `iswcdb`)

---

### Executando o Backend (Java Spring Boot)

1. Entre no diretório do backend:
   ```bash
   cd backend
   ```
2. Inicie a aplicação com o Maven plugin:
   ```bash
   mvn spring-boot:run
   ```
   *A API estará ativa em `http://localhost:8080/api`*

---

### Executando o Frontend (React / Vite)

1. Entre no diretório do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências caso ainda não tenha feito:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O dashboard web estará acessível em `http://localhost:5173`*

---

## 🛡️ Credenciais de Acesso (Login Administrativo)
Para inserir ou modificar obras e splits no dashboard, faça login com as credenciais padrão de desenvolvimento:
* **Usuário:** `admin`
* **Senha:** `nso1810`
