# Enviador de Emails - Email Marketing Campaign Manager

## Descrição

Este é um sistema completo de **gestão de campanhas de email marketing**. Ele permite criar listas de emails, enviar campanhas personalizadas e acompanhar estatísticas de desempenho, como **aberturas** e **cliques** dos emails enviados. O projeto foi desenvolvido usando **Node.js** para o backend e **MySQL/MariaDB** como banco de dados. O frontend é desenvolvido em **HTML**, **CSS** (Bootstrap) e **JavaScript**, fornecendo uma interface simples e eficiente para gerenciar campanhas de marketing por email.

## Funcionalidades

- **Login de administrador**: Proteção do sistema com autenticação simples.
- **Gestão de listas de emails**: Criar, editar, remover e importar listas de emails de contatos.
- **Envio de campanhas**: Criação e envio de campanhas de email, com conteúdo HTML dinâmico.
- **Estatísticas de campanhas**: Relatórios de emails enviados, abertos e cliques em links dos emails.
- **Progressão de envio**: Barra de progresso para acompanhar o envio das campanhas.
- **Personalização de emails**: Suporte a placeholders como `{first_name}`, `{last_name}`, `{email}`, e `{phone}` no conteúdo das campanhas, substituindo pelos dados reais dos destinatários.
- **Importação de contatos via CSV**: Possibilidade de adicionar contatos em massa a partir de arquivos CSV.

## Tecnologias Utilizadas

- **Node.js**: Usado para o backend, com gerenciamento de rotas e integração com o banco de dados.
- **Express.js**: Framework para criação de rotas e manipulação de requisições HTTP.
- **MySQL/MariaDB**: Banco de dados relacional usado para armazenar listas de emails, estatísticas de campanhas e detalhes dos usuários.
- **Nodemailer**: Biblioteca usada para o envio de emails através de servidores SMTP.
- **Bootstrap**: Usado no frontend para estilizar a interface e torná-la responsiva.
- **JavaScript (Frontend)**: Manipulação do DOM e requisições AJAX para o backend.
- **Multer**: Biblioteca para upload de arquivos, usada para importação de contatos via CSV.

## Estrutura do Projeto

### Backend

Gerencia o envio de emails, processamento de listas, coleta de estatísticas e autenticação.

- **Arquivos importantes**:
  - `app.js`: Configuração e inicialização do servidor Express.
  - `controllers/emailController.js`: Lógica de envio de emails e gestão de campanhas.
  - `routes/emailRoutes.js`: Define as rotas da API REST para gerenciamento de listas, envio de emails e estatísticas.
  - `config/database.js`: Conexão com o banco de dados MySQL/MariaDB.

### Frontend

Formulários para criação de campanhas, gestão de listas e visualização de estatísticas.

- **Arquivos importantes**:
  - `public/envio.html`: Página para envio de campanhas.
  - `public/dashboard.html`: Dashboard principal com resumo de estatísticas de campanhas.
  - `public/listas.html`: Gerenciamento de listas de emails.
  - `public/css/`: Estilos CSS personalizados.

## Pré-requisitos

- **Node.js** (v16+)
- **MySQL ou MariaDB**
- **Nodemailer** configurado com um servidor SMTP (Mailgun, Gmail, etc.)

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/usuario/enviador-emails.git
   cd enviador-emails
   ```

2. Instale as dependências:
    ```bash
    Copiar código
    npm install
    ```

3. Configure o banco de dados MySQL/MariaDB:

Crie um banco de dados e utilize esta estrutura

```bash
    -- Tabela para armazenar as campanhas de e-mail
    CREATE TABLE IF NOT EXISTS campaigns (
      id INT AUTO_INCREMENT PRIMARY KEY,
      subject VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Tabela para armazenar listas de e-mails
    CREATE TABLE IF NOT EXISTS email_lists (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Tabela para armazenar os destinatários das listas de e-mails
    CREATE TABLE IF NOT EXISTS email_list_recipients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      list_id INT NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      FOREIGN KEY (list_id) REFERENCES email_lists(id) ON DELETE CASCADE
    );
    
    -- Tabela para armazenar as estatísticas dos e-mails enviados
    CREATE TABLE IF NOT EXISTS email_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255),
      message TEXT,
      list_id INT,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      opened BOOLEAN DEFAULT FALSE,
      clicked BOOLEAN DEFAULT FALSE,
      rejected BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (list_id) REFERENCES email_lists(id) ON DELETE SET NULL
    );
    
    -- Índices para melhorar a busca por destinatários e estatísticas
    CREATE INDEX idx_email ON email_list_recipients (email);
    CREATE INDEX idx_list_id ON email_list_recipients (list_id);
    CREATE INDEX idx_subject ON email_stats (subject);
    
    -- Tabela para armazenar as mensagens rastreadas por abertura e cliques
    CREATE TABLE IF NOT EXISTS email_tracking (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      campaign_id INT,
      opened_at TIMESTAMP NULL,
      clicked_at TIMESTAMP NULL,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
    );
```

4. Configure o arquivo config/database.js com as credenciais do banco de dados:
```bash
  import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'email_marketing',
});
export default pool.promise();
```


5. Execute o servidor:
```bash
  npm start
```

6. Acesse o sistema pelo navegador:
```bash
http://localhost:3000
```


## Uso
- Faça login como administrador (admin@admin.com/ 12345678).
- Crie listas de emails na aba "Listas".
- Crie campanhas na aba "Envio de Campanhas", e acompanhe o progresso.
- Acesse as estatísticas de campanhas enviadas no "Dashboard".
