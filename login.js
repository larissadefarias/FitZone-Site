function showMessage(msg, isError = false) {
    const msgDiv = document.getElementById('message');
    msgDiv.innerText = msg;
    msgDiv.style.color = isError ? 'red' : 'green';
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
            
        });
        const data = await res.json();
        
        if (res.ok) {
            showMessage(data.message);
            // Salva o nome do usuário logado na memória do navegador
            localStorage.setItem('usuarioLogado', login);
            // Redireciona para o Dashboard
            window.location.href = '/index.html';
        } else {
            showMessage(data.message, true);
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor.', true);
    }
});