const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'users.json');

// Middlewares para processar JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    console.log('Rota / foi acessada');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Função auxiliar para ler o "banco de dados"
function readDatabase() {
    if (!fs.existsSync(DB_FILE)) return [];
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data || '[]');
}

// Função auxiliar para salvar no "banco de dados"
function saveDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Rota de Cadastro
app.post('/api/register', (req, res) => {
    const { login, email, password } = req.body;

    if (!login || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const users = readDatabase();

    // Verifica se o usuário já existe
    if (users.find(u => u.login === login || u.email === email)) {
        return res.status(409).json({ message: 'Login ou e-mail já cadastrado.' });
    }

    // Cria e salva o novo usuário
    const newUser = { login, email, password };
    users.push(newUser);
    saveDatabase(users);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

// Rota de Login
app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'Login e senha são obrigatórios.' });
    }

    const users = readDatabase();

    // Autenticação simples
    const user = users.find(u => u.login === login && u.password === password);

    if (user) {
        res.status(200).json({ message: 'Login realizado com sucesso!' });
    } else {
        res.status(401).json({ message: 'Login ou senha incorretos.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
app.use((req, res) => {
    console.log('Rota não encontrada:', req.url);
    res.status(404).send('Página não encontrada');
});