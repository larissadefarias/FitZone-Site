document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    const header = document.querySelector(".site-header");
    const themeButton = document.querySelector("#theme-button");

    const menuMobileButton =
        document.querySelector("#menu-mobile-btn");

    const navList = document.querySelector(".nav-list");

    /* ==================== TEMA ESCURO ==================== */

    const temaSalvo =
        localStorage.getItem("fitzone-tema");

    if (temaSalvo === "escuro") {
        body.classList.add("dark-mode");
    }

    themeButton?.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        const temaAtual =
            body.classList.contains("dark-mode")
                ? "escuro"
                : "claro";

        localStorage.setItem(
            "fitzone-tema",
            temaAtual
        );
    });


    /* ==================== SOMBRA AO ROLAR ==================== */

    function atualizarHeader() {
        header?.classList.toggle(
            "scrolled",
            window.scrollY > 15
        );
    }

    window.addEventListener(
        "scroll",
        atualizarHeader
    );

    atualizarHeader();


    /* ==================== MENU MOBILE ==================== */

    menuMobileButton?.addEventListener(
        "click",
        () => {
            const aberto =
                menuMobileButton.getAttribute(
                    "aria-expanded"
                ) === "true";

            menuMobileButton.setAttribute(
                "aria-expanded",
                String(!aberto)
            );

            navList?.classList.toggle("aberto");
            menuMobileButton.classList.toggle("ativo", !aberto);
        }
    );


    /* Dropdowns no menu mobile */
    document.querySelectorAll(".dropdown > .submenu").forEach((botao) => {
        botao.addEventListener("click", () => {
            if (window.innerWidth > 980) return;

            const dropdown = botao.closest(".dropdown");
            const vaiAbrir = !dropdown.classList.contains("aberto");

            document.querySelectorAll(".dropdown.aberto").forEach((item) => {
                if (item !== dropdown) {
                    item.classList.remove("aberto");
                    item.querySelector(".submenu")?.setAttribute("aria-expanded", "false");
                }
            });

            dropdown.classList.toggle("aberto", vaiAbrir);
            botao.setAttribute("aria-expanded", String(vaiAbrir));
        });
    });

    navList?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth > 980) return;
            navList.classList.remove("aberto");
            menuMobileButton?.classList.remove("ativo");
            menuMobileButton?.setAttribute("aria-expanded", "false");
        });
    });
});