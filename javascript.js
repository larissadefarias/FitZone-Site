document.addEventListener("DOMContentLoaded", () => {
  /* ==================================================
     ELEMENTOS
  ================================================== */

  const body = document.body;

  const botaoAbrirCarrinho = document.querySelector(".button-carrinho");
  const botaoFecharCarrinho = document.querySelector("#fechar-carrinho");
  const carrinho = document.querySelector("#carrinho");
  const carrinhoOverlay = document.querySelector("#carrinho-overlay");

  const carrinhoItens = document.querySelector("#carrinho-itens");
  const contadorCarrinho = document.querySelector("#contador-carrinho");
  const totalCarrinho = document.querySelector("#total");

  const botoesComprar = document.querySelectorAll(".btn-comprar");
  const botaoFinalizar = document.querySelector(".btn-finalizar");

  const toast = document.querySelector("#toast");

  const popup = document.querySelector("#popup-anuncio");
  const popupClose = document.querySelector(".popup-close");
  const popupButton = document.querySelector(".popup-btn");

  const formularioPesquisa = document.querySelector(".search-box");
  const campoPesquisa = document.querySelector(".box-search");

  const botoesFavoritos = document.querySelectorAll(".produto-favorito");


  /* ==================================================
     DADOS DO CARRINHO
  ================================================== */

  let produtosCarrinho = carregarCarrinho();


  function carregarCarrinho() {
    try {
      const carrinhoSalvo = localStorage.getItem("fitzone-carrinho");

      return carrinhoSalvo
        ? JSON.parse(carrinhoSalvo)
        : [];
    } catch (erro) {
      console.error("Erro ao carregar o carrinho:", erro);
      return [];
    }
  }


  function salvarCarrinho() {
    localStorage.setItem(
      "fitzone-carrinho",
      JSON.stringify(produtosCarrinho)
    );
  }


  /* ==================================================
     ABRIR E FECHAR CARRINHO
  ================================================== */

  function abrirCarrinho() {
    if (!carrinho || !carrinhoOverlay) {
      return;
    }

    carrinho.classList.add("ativo");
    carrinhoOverlay.classList.add("ativo");

    carrinho.setAttribute("aria-hidden", "false");

    body.classList.add("no-scroll");
  }


  function fecharCarrinho() {
    if (!carrinho || !carrinhoOverlay) {
      return;
    }

    carrinho.classList.remove("ativo");
    carrinhoOverlay.classList.remove("ativo");

    carrinho.setAttribute("aria-hidden", "true");

    body.classList.remove("no-scroll");
  }


  botaoAbrirCarrinho?.addEventListener(
    "click",
    abrirCarrinho
  );


  botaoFecharCarrinho?.addEventListener(
    "click",
    fecharCarrinho
  );


  carrinhoOverlay?.addEventListener(
    "click",
    fecharCarrinho
  );


  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      fecharCarrinho();
      fecharPopup();
    }
  });


  /* ==================================================
     ADICIONAR PRODUTOS
  ================================================== */

  botoesComprar.forEach((botao) => {
    botao.addEventListener("click", () => {
      const cardProduto = botao.closest(
        ".produto, .card-novidade"
      );

      if (!cardProduto) {
        return;
      }

      const nome = cardProduto.dataset.nome;
      const preco = Number(cardProduto.dataset.preco);

      const imagem =
        cardProduto.querySelector(".produto-imagem img");

      if (!nome || Number.isNaN(preco)) {
        console.error(
          "Nome ou preço do produto não encontrado."
        );

        return;
      }

      adicionarProduto({
        nome,
        preco,
        imagem: imagem?.getAttribute("src") || "",
        quantidade: 1
      });
    });
  });


  function adicionarProduto(novoProduto) {
    const produtoExistente = produtosCarrinho.find(
      (produto) => produto.nome === novoProduto.nome
    );

    if (produtoExistente) {
      produtoExistente.quantidade += 1;
    } else {
      produtosCarrinho.push(novoProduto);
    }

    atualizarCarrinho();
    mostrarToast(`${novoProduto.nome} adicionado ao carrinho!`);
  }


  /* ==================================================
     EXIBIR CARRINHO
  ================================================== */

  function atualizarCarrinho() {
    if (
      !carrinhoItens ||
      !contadorCarrinho ||
      !totalCarrinho
    ) {
      return;
    }

    carrinhoItens.innerHTML = "";

    if (produtosCarrinho.length === 0) {
      carrinhoItens.innerHTML = `
                <div class="carrinho-vazio">
                    <span>Seu carrinho está vazio.</span>

                    <p>
                        Adicione produtos para começar sua compra.
                    </p>
                </div>
            `;
    } else {
      produtosCarrinho.forEach(
        (produto, indice) => {
          const subtotal =
            produto.preco * produto.quantidade;

          const item = document.createElement("article");

          item.classList.add("item-carrinho");

          item.innerHTML = `
                        <div class="item-carrinho-imagem">
                            <img
                                src="${produto.imagem}"
                                alt="${produto.nome}"
                            >
                        </div>

                        <div class="item-carrinho-info">

                            <div class="item-carrinho-topo">

                                <h3>${produto.nome}</h3>

                                <button
                                    class="remover-item"
                                    type="button"
                                    aria-label="Remover ${produto.nome}"
                                    data-indice="${indice}"
                                >
                                    ×
                                </button>

                            </div>

                            <p class="item-preco">
                                ${formatarMoeda(produto.preco)}
                            </p>

                            <div class="item-carrinho-rodape">

                                <div class="controle-quantidade">

                                    <button
                                        class="diminuir-quantidade"
                                        type="button"
                                        data-indice="${indice}"
                                        aria-label="Diminuir quantidade"
                                    >
                                        −
                                    </button>

                                    <span>
                                        ${produto.quantidade}
                                    </span>

                                    <button
                                        class="aumentar-quantidade"
                                        type="button"
                                        data-indice="${indice}"
                                        aria-label="Aumentar quantidade"
                                    >
                                        +
                                    </button>

                                </div>

                                <strong>
                                    ${formatarMoeda(subtotal)}
                                </strong>

                            </div>

                        </div>
                    `;

          carrinhoItens.appendChild(item);
        }
      );
    }

    adicionarEventosCarrinho();
    atualizarResumoCarrinho();
    salvarCarrinho();
  }


  function atualizarResumoCarrinho() {
    const quantidadeTotal = produtosCarrinho.reduce(
      (total, produto) => {
        return total + produto.quantidade;
      },
      0
    );

    const valorTotal = produtosCarrinho.reduce(
      (total, produto) => {
        return (
          total +
          produto.preco * produto.quantidade
        );
      },
      0
    );

    contadorCarrinho.textContent = quantidadeTotal;
    totalCarrinho.textContent = formatarMoeda(valorTotal);

    contadorCarrinho.style.display =
      quantidadeTotal > 0
        ? "grid"
        : "none";
  }


  function adicionarEventosCarrinho() {
    const botoesRemover =
      carrinhoItens.querySelectorAll(".remover-item");

    const botoesDiminuir =
      carrinhoItens.querySelectorAll(
        ".diminuir-quantidade"
      );

    const botoesAumentar =
      carrinhoItens.querySelectorAll(
        ".aumentar-quantidade"
      );


    botoesRemover.forEach((botao) => {
      botao.addEventListener("click", () => {
        const indice = Number(botao.dataset.indice);

        removerProduto(indice);
      });
    });


    botoesDiminuir.forEach((botao) => {
      botao.addEventListener("click", () => {
        const indice = Number(botao.dataset.indice);

        alterarQuantidade(indice, -1);
      });
    });


    botoesAumentar.forEach((botao) => {
      botao.addEventListener("click", () => {
        const indice = Number(botao.dataset.indice);

        alterarQuantidade(indice, 1);
      });
    });
  }


  function alterarQuantidade(indice, alteracao) {
    const produto = produtosCarrinho[indice];

    if (!produto) {
      return;
    }

    produto.quantidade += alteracao;

    if (produto.quantidade <= 0) {
      produtosCarrinho.splice(indice, 1);
    }

    atualizarCarrinho();
  }


  function removerProduto(indice) {
    const produtoRemovido = produtosCarrinho[indice];

    produtosCarrinho.splice(indice, 1);

    atualizarCarrinho();

    if (produtoRemovido) {
      mostrarToast(
        `${produtoRemovido.nome} removido do carrinho.`
      );
    }
  }


  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }


  /* ==================================================
     FINALIZAR COMPRA
  ================================================== */

  botaoFinalizar?.addEventListener("click", () => {
    if (produtosCarrinho.length === 0) {
      mostrarToast(
        "Adicione produtos antes de finalizar."
      );

      return;
    }

    alert(
      "Compra finalizada com sucesso!\n\n" +
      "Esta é uma simulação acadêmica da FitZone."
    );

    produtosCarrinho = [];

    atualizarCarrinho();
    fecharCarrinho();
  });


  /* ==================================================
     TOAST
  ================================================== */

  let temporizadorToast;


  function mostrarToast(mensagem) {
    if (!toast) {
      return;
    }

    clearTimeout(temporizadorToast);

    toast.textContent = mensagem;
    toast.classList.add("ativo");

    temporizadorToast = setTimeout(() => {
      toast.classList.remove("ativo");
    }, 2500);
  }


  /* ==================================================
     TEMA ESCURO
  ================================================== */

  const temaSalvo =
    localStorage.getItem("fitzone-tema");


  if (temaSalvo === "escuro") {
    body.classList.add("dark-mode");
  }




  /* ==================================================
     POPUP DE PROMOÇÃO
  ================================================== */

  function abrirPopup() {
    if (!popup) {
      return;
    }

    const popupJaMostrado =
      sessionStorage.getItem("fitzone-popup");

    if (popupJaMostrado) {
      return;
    }

    popup.classList.add("ativo");

    sessionStorage.setItem(
      "fitzone-popup",
      "mostrado"
    );
  }


  function fecharPopup() {
    popup?.classList.remove("ativo");
  }


  const temporizadorPopup = setTimeout(() => {
    abrirPopup();
  }, 2500);


  popupClose?.addEventListener(
    "click",
    fecharPopup
  );


  popupButton?.addEventListener(
    "click",
    fecharPopup
  );


  popup?.addEventListener("click", (event) => {
    if (event.target === popup) {
      fecharPopup();
    }
  });


  /* ==================================================
     PESQUISA DE PRODUTOS
  ================================================== */

  formularioPesquisa?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      pesquisarProdutos();
    }
  );


  function pesquisarProdutos() {
    const termo = campoPesquisa
      ?.value
      .trim()
      .toLowerCase();

    if (!termo) {
      mostrarToast(
        "Digite o nome de um produto."
      );

      return;
    }

    const produtos = document.querySelectorAll(
      ".produto, .card-novidade"
    );

    let produtoEncontrado = null;


    produtos.forEach((produto) => {
      const nome = produto.dataset.nome
        ?.toLowerCase();

      if (
        nome &&
        nome.includes(termo) &&
        !produtoEncontrado
      ) {
        produtoEncontrado = produto;
      }
    });


    if (produtoEncontrado) {
      produtoEncontrado.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      produtoEncontrado.classList.add(
        "produto-encontrado"
      );

      setTimeout(() => {
        produtoEncontrado.classList.remove(
          "produto-encontrado"
        );
      }, 2200);

      mostrarToast("Produto encontrado!");
    } else {
      mostrarToast(
        "Nenhum produto encontrado."
      );
    }
  }


  /* ==================================================
     FAVORITOS
  ================================================== */

  botoesFavoritos.forEach((botao) => {
    botao.addEventListener("click", () => {
      botao.classList.toggle("favorito");

      const favorito =
        botao.classList.contains("favorito");

      botao.textContent =
        favorito
          ? "♥"
          : "♡";

      mostrarToast(
        favorito
          ? "Produto adicionado aos favoritos!"
          : "Produto removido dos favoritos."
      );
    });
  });


  /* ==================================================
     LINKS INTERNOS DO CARRINHO E POPUP
  ================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {
      link.addEventListener("click", () => {
        fecharCarrinho();
      });
    });


  /* ==================================================
     INICIALIZAÇÃO
  ================================================== */

  atualizarCarrinho();
});