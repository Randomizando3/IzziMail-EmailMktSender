import express from 'express';
import session from 'express-session'; // Para gerenciar sessões
import path from 'path';
import emailRoutes from './routes/emailRoutes.js';

const app = express();

// Middleware para processar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de sessão
app.use(session({
  secret: 'suasenhadedesenvolvedor',
  resave: false,
  saveUninitialized: true,
}));

// Middleware para verificar a autenticação
function checkAuth(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login.html'); // Redireciona para a página de login
  }
}

// Servir arquivos estáticos (somente CSS, JS, imagens) da pasta "public"
const __dirname = path.resolve();
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Rotas protegidas para as páginas HTML
app.get('/envio.html', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'envio.html'));
});

app.get('/dashboard.html', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/listas.html', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'listas.html'));
});

// Rota para a página de login (não protegida)
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para realizar logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html'); // Redireciona para o login após o logout
  });
});

// Rotas de API
app.use('/emails', emailRoutes);

// Página inicial (redirecionar para login ou dashboard)
app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard.html');
  } else {
    res.redirect('/login.html');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
