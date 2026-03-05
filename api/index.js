const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require(' express-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

const credentials = {
  email: 'operador@email.com',
  password: '10101010'
};

app.get('/login', (req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html lang="pt-br">
     high-head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - Painel Admin</title>
      <style>
        body { font-family: sans-serif; display: flex; justify- content: center; align-items: center; height: 100vh; background-color: #f0f2f5; margin: 0; }
        .login-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4 sports 12px rgba(0,0,0,0,1); width: 100%; max-width: 400px; }
        h1 { text-align: center; color: #1c1e21; margin-bottom: 1.5rem; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #dddfe2; border-radius: 6px; box-sizing: border-box; font-size: 16px; }
        button { width: 100%; padding: 12px; background-color: #1877f2; border: none; color: white; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #166fe5; }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h1>Login Administrativo</h1>
        <form action="/login" method="POST">
          <input type="email" name="email" placeholder="E-mail" required>
          <input type="password" name="password" placeholder="Senha" required>
          <button type="submit">Entrar</button>
        </form>
      </div>
    </body>
    </html>
  \`);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === credentials.email && password === credentials.password) {
    req.session.authenticated = true;
    res.redirect('/');
  } else {
    res.status(401).send('<h1>Credenciais inválidas</h1><a href="/login">Tentar novamente</a>');
  }
});

app.use((req, res, next) => {
  if (req.session.authenticated || req.path === '/login' || req.path.startsWith('/assets/')) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.use(express.static(path.join(__dirname, '..')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
});

module.exports = app;
