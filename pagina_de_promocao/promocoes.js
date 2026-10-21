import { produtos } from "../todos_produtos.js";


// ======================================================
// PRODUTOS EM PROMOÇÃO
// ======================================================

const produtosPromocao = produtos.filter(produto => {

    if (produto.precoPromocional === undefined) {
        return false;
    }

    if (!produto.validadePromocao) {
        return true;
    }

    return promocaoValida(produto.validadePromocao);
});

function promocaoValida(data) {

    const partes = data.split("/");

    const dia = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const ano = Number(partes[2]);

    const validade = new Date(
        ano,
        mes,
        dia,
        23,
        59,
        59
    );

    return new Date() <= validade;
}


// ======================================================
// CONTROLE DOS CARROSSÉIS
// ======================================================

const carrosseisAtivos = {};
const intervalosCarrosseis = {};


// ======================================================
// FORMATA PREÇO
// ======================================================

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ======================================================
// FORMATA O NOME DA CATEGORIA
// ======================================================

function formatarCategoria(categoria) {

    const categorias = {
        perifericos: "PERIFÉRICOS",
        informatica: "INFORMÁTICA",
        hardware: "HARDWARE",
        monitores: "MONITORES",
        notebooks: "NOTEBOOKS",
        computadores: "COMPUTADORES",
        componentes: "COMPONENTES",
        acessorios: "ACESSÓRIOS",
        fonte: "FONTES",
        placa_mae: "PLACAS MÃE",
        placa_de_video: "PLACAS DE VÍDEO",
        processador: "PROCESSADORES",
        console: "CONSOLES",
        gabinete: "GABINETES",
        outros: "OUTROS",
    };

    const categoriaNormalizada = normalizarCategoria(categoria);

    return categorias[categoriaNormalizada] ||
        categoria
            .replace(/-/g, " ")
            .replace(/\b\w/g, letra => letra.toUpperCase());
}


// ======================================================
// NORMALIZA A CATEGORIA PARA USAR NOS IDS
// ======================================================

function normalizarCategoria(categoria) {

    return categoria
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
}


// ======================================================
// CRIA O CARD
// ======================================================

function criarCardPromocao(produto) {

    const card = document.createElement("article");

    card.className = "card-promocao";

    card.dataset.produtoId = produto.id;

    card.innerHTML = `
        <span class="selo-desconto">
            ${produto.desconto}% OFF
        </span>

        <img
            src="${produto.imagem}"
            alt="${produto.nome}"
            loading="lazy"
        >

        <div class="conteudo-card">

            <p class="categoria-card">
                ${formatarCategoria(produto.categoria)}
            </p>

            <h3>
                ${produto.nome}
            </h3>

            <p class="preco-antigo">
                ${formatarPreco(produto.preco)}
            </p>

            <p class="preco-promocional">
                ${formatarPreco(produto.precoPromocional)}
            </p>

            ${
                produto.validadePromocao
                ? `
                    <p class="validade-promocao">
                        Oferta até ${produto.validadePromocao}
                    </p>
                `
                : ""
            }

            <button
                type="button"
                class="botao-ver-produto"
            >
                VER PRODUTO
            </button>

        </div>
    `;


    // ==================================================
    // BOTÃO VER PRODUTO
    // ==================================================

    const botao = card.querySelector(".botao-ver-produto");

    botao.addEventListener("click", evento => {

        evento.stopPropagation();

        window.location.href =
            `compra_promocao.html?id=${produto.id}`;

    });


    return card;
}


// ======================================================
// ATUALIZA A QUANTIDADE DA CATEGORIA
// ======================================================

function atualizarQuantidadeCategoria(categoria, quantidade) {

    const elemento =
        document.getElementById(`quantidade-${categoria}`);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        quantidade === 1
            ? "1 produto em promoção"
            : `${quantidade} produtos em promoção`;
}


// ======================================================
// CONFIGURA O CARROSSEL
// ======================================================

function configurarCarrossel(categoria) {

    const carrossel =
        document.getElementById(`carrossel-${categoria}`);

    const janela =
        document.getElementById(`janela-${categoria}`);

    const secao =
        document.getElementById(`secao-${categoria}`);


    if (!carrossel || !janela || !secao) {
        return;
    }


    const quantidade =
        carrossel.querySelectorAll(".card-promocao").length;


    const setas =
        secao.querySelectorAll(".seta-carrossel");


    atualizarQuantidadeCategoria(
        categoria,
        quantidade
    );


    // ==================================================
    // NENHUM PRODUTO
    // ==================================================

    if (quantidade === 0) {

        secao.style.display = "none";

        carrosseisAtivos[categoria] = false;

        pararCarrossel(categoria);

        return;
    }


    secao.style.display = "block";


    // ==================================================
    // MENOS DE 4 PRODUTOS
    // ==================================================

    if (quantidade < 4) {

        carrosseisAtivos[categoria] = false;

        carrossel.classList.add("carrossel-parado");

        carrossel.classList.remove("carrossel-quatro");


        setas.forEach(seta => {
            seta.classList.add("oculta");
        });


        pararCarrossel(categoria);

        janela.scrollTo({
            left: 0
        });

        return;
    }


    // ==================================================
    // 4 OU MAIS PRODUTOS
    // ==================================================

    carrosseisAtivos[categoria] = true;

    carrossel.classList.remove("carrossel-parado");

    carrossel.classList.toggle(
        "carrossel-quatro",
        quantidade === 4
    );


    setas.forEach(seta => {
        seta.classList.remove("oculta");
    });


    iniciarCarrossel(categoria);
}


// ======================================================
// MOVE O CARROSSEL
// ======================================================

function moverCarrossel(categoria, direcao) {

    if (carrosseisAtivos[categoria] !== true) {
        return;
    }


    const janela =
        document.getElementById(`janela-${categoria}`);

    const carrossel =
        document.getElementById(`carrossel-${categoria}`);


    if (!janela || !carrossel) {
        return;
    }


    const primeiroCard =
        carrossel.querySelector(".card-promocao");


    if (!primeiroCard) {
        return;
    }


    const estiloCarrossel =
        window.getComputedStyle(carrossel);


    const espaco =
        parseFloat(estiloCarrossel.gap) || 20;


    const passo =
        primeiroCard.offsetWidth + espaco;


    const limite =
        janela.scrollWidth - janela.clientWidth;


    // Chegou ao final
    if (
        direcao > 0 &&
        janela.scrollLeft >= limite - 10
    ) {

        janela.scrollTo({
            left: 0,
            behavior: "smooth"
        });

        return;
    }


    // Chegou ao começo
    if (
        direcao < 0 &&
        janela.scrollLeft <= 10
    ) {

        janela.scrollTo({
            left: limite,
            behavior: "smooth"
        });

        return;
    }


    janela.scrollBy({
        left: passo * direcao,
        behavior: "smooth"
    });
}


// ======================================================
// INICIA O CARROSSEL AUTOMÁTICO
// ======================================================

function iniciarCarrossel(categoria) {

    pararCarrossel(categoria);


    if (carrosseisAtivos[categoria] !== true) {
        return;
    }


    intervalosCarrosseis[categoria] =
        setInterval(() => {

            moverCarrossel(
                categoria,
                1
            );

        }, 3500);
}


// ======================================================
// PARA O CARROSSEL AUTOMÁTICO
// ======================================================

function pararCarrossel(categoria) {

    if (intervalosCarrosseis[categoria]) {

        clearInterval(
            intervalosCarrosseis[categoria]
        );

        intervalosCarrosseis[categoria] = null;
    }
}


// ======================================================
// DISPONIBILIZA AS FUNÇÕES PARA A PESQUISA
// ======================================================

window.moverCarrossel = moverCarrossel;
window.iniciarCarrossel = iniciarCarrossel;
window.pararCarrossel = pararCarrossel;


// ======================================================
// CRIA TODAS AS SEÇÕES AUTOMATICAMENTE
// ======================================================

function criarSecoesPromocao() {

    const container =
        document.getElementById("container-promocoes");


    if (!container) {
        return;
    }


    // Limpa o container antes de criar
    container.innerHTML = "";


    // ==================================================
    // DESCOBRE AS CATEGORIAS
    // ==================================================

    const categorias = [
        ...new Set(
            produtosPromocao.map(
                produto => produto.categoria
            )
        )
    ];


    // ==================================================
    // CRIA UMA SEÇÃO PARA CADA CATEGORIA
    // ==================================================

    categorias.forEach((categoria, indice) => {

        const categoriaId =
            normalizarCategoria(categoria);


        const produtosCategoria =
            produtosPromocao.filter(produto => {

                return produto.categoria === categoria;

            });


        // ==================================================
        // CRIA A SECTION
        // ==================================================

        const secao =
            document.createElement("section");


        secao.className =
            "secao-promocao";


        secao.id =
            `secao-${categoriaId}`;


        secao.innerHTML = `

            <div class="titulo-secao">

                <div>

                    <span>
                        ${String(indice + 1).padStart(2, "0")}
                    </span>

                    <h2>
                        ${formatarCategoria(categoria)}
                    </h2>

                </div>

                <p id="quantidade-${categoriaId}">
                    ${produtosCategoria.length}
                    ${
                        produtosCategoria.length === 1
                            ? "produto"
                            : "produtos"
                    }
                    em promoção
                </p>

            </div>


            <div class="estrutura-carrossel">

                <button
                    class="seta-carrossel"
                    type="button"
                    data-categoria="${categoriaId}"
                    data-direcao="-1"
                    aria-label="Voltar"
                >
                    ‹
                </button>


                <div
                    class="janela-carrossel"
                    id="janela-${categoriaId}"
                >

                    <div
                        class="carrossel"
                        id="carrossel-${categoriaId}"
                    ></div>

                </div>


                <button
                    class="seta-carrossel"
                    type="button"
                    data-categoria="${categoriaId}"
                    data-direcao="1"
                    aria-label="Avançar"
                >
                    ›
                </button>

            </div>
        `;


        container.appendChild(secao);


        // ==================================================
        // ADICIONA OS CARDS
        // ==================================================

        const carrossel =
            document.getElementById(
                `carrossel-${categoriaId}`
            );


        produtosCategoria.forEach(produto => {

            const card =
                criarCardPromocao(produto);


            carrossel.appendChild(card);

        });


        // ==================================================
        // CONFIGURA AS SETAS
        // ==================================================

        secao
            .querySelectorAll(".seta-carrossel")
            .forEach(seta => {

                seta.addEventListener("click", () => {

                    const direcao =
                        Number(
                            seta.dataset.direcao
                        );


                    moverCarrossel(
                        categoriaId,
                        direcao
                    );

                });

            });


        // ==================================================
        // PAUSA AO PASSAR O MOUSE
        // ==================================================

        const janela =
            document.getElementById(
                `janela-${categoriaId}`
            );


        janela.addEventListener(
            "mouseenter",
            () => {
                pararCarrossel(categoriaId);
            }
        );


        janela.addEventListener(
            "mouseleave",
            () => {
                iniciarCarrossel(categoriaId);
            }
        );


        // ==================================================
        // CONFIGURA O CARROSSEL
        // ==================================================

        configurarCarrossel(
            categoriaId
        );

    });
}


// ======================================================
// INICIALIZA A PÁGINA
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        criarSecoesPromocao();

    }
);