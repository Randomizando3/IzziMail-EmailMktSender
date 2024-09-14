Enviador de Emails - Email Marketing Campaign Manager
Descrição
Este é um sistema completo de gestão de campanhas de email marketing. Ele permite criar listas de emails, enviar campanhas personalizadas e acompanhar estatísticas de desempenho, como aberturas e cliques dos emails enviados. O projeto foi desenvolvido usando Node.js para o backend e MySQL/MariaDB como banco de dados. O frontend é desenvolvido em HTML, CSS (Bootstrap) e JavaScript, fornecendo uma interface simples e eficiente para gerenciar campanhas de marketing por email.

Funcionalidades
Login de administrador: Proteção do sistema com autenticação simples.
Gestão de listas de emails: Criar, editar, remover e importar listas de emails de contatos.
Envio de campanhas: Criação e envio de campanhas de email, com conteúdo HTML dinâmico.
Estatísticas de campanhas: Relatórios de emails enviados, abertos e cliques em links dos emails.
Progressão de envio: Barra de progresso para acompanhar o envio das campanhas.
Personalização de emails: Suporte a placeholders como {first_name}, {last_name}, {email}, e {phone} no conteúdo das campanhas, substituindo pelos dados reais dos destinatários.
Importação de contatos via CSV: Possibilidade de adicionar contatos em massa a partir de arquivos CSV.
Tecnologias Utilizadas
Node.js: Usado para o backend, com gerenciamento de rotas e integração com o banco de dados.
Express.js: Framework para criação de rotas e manipulação de requisições HTTP.
MySQL/MariaDB: Banco de dados relacional usado para armazenar listas de emails, estatísticas de campanhas e detalhes dos usuários.
Nodemailer: Biblioteca usada para o envio de emails através de servidores SMTP.
Bootstrap: Usado no frontend para estilizar a interface e torná-la responsiva.
JavaScript (Frontend): Manipulação do DOM e requisições AJAX para o backend.
Multer: Biblioteca para upload de arquivos, usada para importação de contatos via CSV.
Estrutura do Projeto
Backend
Gerencia o envio de emails, processamento de listas, coleta de estatísticas e autenticação.
Arquivos importantes:
app.js: Configuração e inicialização do servidor Express.
controllers/emailController.js: Lógica de envio de emails e gestão de campanhas.
routes/emailRoutes.js: Define as rotas da API REST para gerenciamento de listas, envio de emails e estatísticas.
config/database.js: Conexão com o banco de dados MySQL/MariaDB.
Frontend
Formulários para criação de campanhas, gestão de listas e visualização de estatísticas.
Arquivos importantes:
public/envio.html: Página para envio de campanhas.
public/dashboard.html: Dashboard principal com resumo de estatísticas de campanhas.
public/listas.html: Gerenciamento de listas de emails.
public/css/: Estilos CSS personalizados.
Pré-requisitos
Node.js (v16+)
MySQL ou MariaDB
Nodemailer configurado com um servidor SMTP (Mailgun, Gmail, etc.)
Instalação
Clone este repositório:

bash
Copiar código
git clone https://github.com/usuario/enviador-emails.git
cd enviador-emails
Instale as dependências:

bash
Copiar código
npm install
Configure o banco de dados MySQL/MariaDB:

Crie um banco de dados chamado email_marketing.

Importe o arquivo SQL com a estrutura do banco:

bash
Copiar código
mysql -u root -p email_marketing < db_structure.sql
Configure o arquivo config/database.js com as credenciais do banco de dados:

javascript
Copiar código
import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'email_marketing',
});

export default pool.promise();
Execute o servidor:

bash
Copiar código
npm start
Acesse o sistema pelo navegador:

arduino
Copiar código
http://localhost:3000
Uso
Faça login como administrador (admin@cadastrodeempresas.com / sist2016!).
Crie listas de emails na aba "Listas".
Crie campanhas na aba "Envio de Campanhas", e acompanhe o progresso.
Acesse as estatísticas de campanhas enviadas no "Dashboard".
Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
