# FitZone: loja esportiva (site)

Site de uma loja de roupas, calçados e acessórios esportivos, com carrinho de compras, modo escuro, busca de produtos, login e cadastro de usuários.

Projeto em grupo, desenvolvido em 2026.

<p align="center">
  <img src="docs/tela-inicial.png" alt="Página inicial do FitZone, com banner escuro, busca de produtos e menu" width="800">
</p>

## Funcionalidades

**Loja**
- Carrinho lateral: adicionar produtos, alterar a quantidade, remover itens e ver o total em reais
- O carrinho é salvo no navegador, então continua depois de recarregar a página
- Finalização de compra com aviso na tela
- Busca de produtos
- Botão de favoritar produtos
- Popup de promoção, exibido uma vez por visita

**Conta de usuário**
- Cadastro com validação de e-mail, senha de no mínimo 5 caracteres e confirmação de senha
- Login com mensagens de sucesso e de erro, vindas do servidor

**Experiência de uso**
- Modo escuro, com a escolha salva no navegador
- Layout responsivo, com menu para celular
- Cabeçalho que ganha sombra ao rolar a página

**Páginas**
- Início, Sobre nós, Contato, Trabalhe conosco, Login e Cadastro

## Tecnologias

- HTML5 e CSS3
- JavaScript
- [Node.js](https://nodejs.org/) e [Express](https://expressjs.com/) 5

## Como rodar o projeto

**Pré-requisito:** [Node.js](https://nodejs.org/) instalado.

1. Clone o repositório:
   ```bash
   git clone https://github.com/larissadefarias/FitZone-Site.git
   cd FitZone-Site
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   node server.js
   ```

4. Abra no navegador: [http://localhost:3000](http://localhost:3000)

Os usuários cadastrados ficam no arquivo `users.json`, que é criado pelo servidor na primeira vez que alguém se cadastra.

## Observações

Este é um projeto acadêmico. Por isso, o cadastro e o login usam um arquivo local no lugar de um banco de dados, e as senhas são guardadas sem criptografia. O arquivo `users.json` não é enviado ao GitHub. Para usar em produção, seria necessário um banco de dados e o armazenamento seguro das senhas (com hash).

## Equipe

<!-- Adicione aqui todos os integrantes do grupo e o que cada um desenvolveu. -->
- **Larissa de Farias Santos**: [GitHub](https://github.com/larissadefarias)

## Licença

Veja o arquivo [LICENSE](LICENSE).
