[b]Enviador de Emails - Email Marketing Campaign Manager[/b]

[i]Descrição[/i]

Este é um sistema completo de [b]gestão de campanhas de email marketing[/b]. Ele permite criar listas de emails, enviar campanhas personalizadas e acompanhar estatísticas de desempenho, como [b]aberturas[/b] e [b]cliques[/b] dos emails enviados. O projeto foi desenvolvido usando [b]Node.js[/b] para o backend e [b]MySQL/MariaDB[/b] como banco de dados. O frontend é desenvolvido em [b]HTML[/b], [b]CSS[/b] (Bootstrap) e [b]JavaScript[/b], fornecendo uma interface simples e eficiente para gerenciar campanhas de marketing por email.

[i]Funcionalidades[/i]

- [b]Login de administrador[/b]: Proteção do sistema com autenticação simples.
- [b]Gestão de listas de emails[/b]: Criar, editar, remover e importar listas de emails de contatos.
- [b]Envio de campanhas[/b]: Criação e envio de campanhas de email, com conteúdo HTML dinâmico.
- [b]Estatísticas de campanhas[/b]: Relatórios de emails enviados, abertos e cliques em links dos emails.
- [b]Progressão de envio[/b]: Barra de progresso para acompanhar o envio das campanhas.
- [b]Personalização de emails[/b]: Suporte a placeholders como [code]{first_name}[/code], [code]{last_name}[/code], [code]{email}[/code], e [code]{phone}[/code] no conteúdo das campanhas, substituindo pelos dados reais dos destinatários.
- [b]Importação de contatos via CSV[/b]: Possibilidade de adicionar contatos em massa a partir de arquivos CSV.

[i]Tecnologias Utilizadas[/i]

- [b]Node.js[/b]: Usado para o backend, com gerenciamento de rotas e integração com o banco de dados.
- [b]Express.js[/b]: Framework para criação de rotas e manipulação de requisições HTTP.
- [b]MySQL/MariaDB[/b]: Banco de dados relacional usado para armazenar listas de emails, estatísticas de campanhas e detalhes dos usuários.
- [b]Nodemailer[/b]: Biblioteca usada para o envio de emails através de servidores SMTP.
- [b]Bootstrap[/b]: Usado no frontend para estilizar a interface e torná-la responsiva.
- [b]JavaScript (Frontend)[/b]: Manipulação do DOM e requisições AJAX para o backend.
- [b]Multer[/b]: Biblioteca para upload de arquivos, usada para importação de contatos via CSV.

[i]Estrutura do Projeto[/i]

- [b]Backend[/b]
  - Gerencia o envio de emails, processamento de listas, coleta de estatísticas e autenticação.
  - Arquivos importantes:
    - [code]app.js[/code]: Configuração e inicialização do servidor Express.
    - [code]controllers/emailController.js[/code]: Lógica de envio de emails e gestão de campanhas.
    - [code]routes/emailRoutes.js[/code]: Define as rotas da API REST para gerenciamento de listas, envio de emails e estatísticas.
    - [code]config/database.js[/code]: Conexão com o banco de dados MySQL/MariaDB.
  
- [b]Frontend[/b]
  - Formulários para criação de campanhas, gestão de listas e visualização de estatísticas.
  - Arquivos importantes:
    - [code]public/envio.html[/code]: Página para envio de campanhas.
    - [code]public/dashboard.html[/code]: Dashboard principal com resumo de estatísticas de campanhas.
    - [code]public/listas.html[/code]: Gerenciamento de listas de emails.
    - [code]public/css/[/code]: Estilos CSS personalizados.

[i]Pré-requisitos[/i]

- [b]Node.js[/b] (v16+)
- [b]MySQL ou MariaDB[/b]
- [b]Nodemailer[/b] configurado com um servidor SMTP (Mailgun, Gmail, etc.)

[i]Instalação[/i]

1. Clone este repositório:

[code]
git clone https://github.com/usuario/enviador-emails.git
cd enviador-emails
[/code]

2. Instale as dependências:

[code]
npm install
[/code]

3. Configure o banco de dados MySQL/MariaDB:

- Crie um banco de dados chamado [b]email_marketing[/b].
- Importe o arquivo SQL com a estrutura do banco:
   
[code]
mysql -u root -p email_marketing < db_structure.sql
[/code]

4. Configure o arquivo [code]config/database.js[/code] com as credenciais do banco de dados:

[code]
import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'email_marketing',
});

export default pool.promise();
[/code]

5. Execute o servidor:

[code]
npm start
[/code]

6. Acesse o sistema pelo navegador:

[code]
http://localhost:3000
[/code]

[i]Uso[/i]

1. Faça login como administrador ([b]admin@admin.com[/b] / [b]12345678[/b]).
2. Crie listas de emails na aba "Listas".
3. Crie campanhas na aba "Envio de Campanhas", e acompanhe o progresso.
4. Acesse as estatísticas de campanhas enviadas no "Dashboard".

[i]Licença[/i]

Este projeto está licenciado sob a licença MIT. Veja o arquivo [code]LICENSE[/code] para mais detalhes.
