import { produtos } from "../todos_produtos.js";


// PEGA O ID DO PRODUTO NA URL

const parametrosPromocao =
    new URLSearchParams(window.location.search);

const idPromocao =
    Number(parametrosPromocao.get("id"));


// LOCALIZA O PRODUTO NO ARQUIVO todos_produtos.js

const produtoPromocao =
    produtos.find(produto => produto.id === idPromocao);


// SE O PRODUTO NÃO EXISTIR

if (!produtoPromocao) {

    document.body.innerHTML = `
        <main style="
            padding: 50px;
            text-align: center;
            font-family: Arial, sans-serif;
        ">

            <h1>Produto não encontrado</h1>

            <p>
                O produto promocional solicitado não existe.
            </p>

            <a href="promocoes.html">
                Voltar para as promoções
            </a>

        </main>
    `;

} else {

    carregarProdutoPromocao();

}


// FORMATA PREÇOS EM REAL

function formatarPreco(valor) {

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// FORMATA O NOME DA CATEGORIA

function formatarCategoria(categoria) {

    const categorias = {

        perifericos: "PERIFÉRICOS",
        informatica: "INFORMÁTICA",
        hardware: "HARDWARE",
        monitores: "MONITORES",
        notebooks: "NOTEBOOKS",
        computadores: "COMPUTADORES",
        componentes: "COMPONENTES",
        acessorios: "ACESSÓRIOS"

    };

    return categorias[categoria] ||
        categoria
            .replace(/-/g, " ")
            .replace(/\b\w/g, letra => letra.toUpperCase());

}


// CARREGA AS INFORMAÇÕES DO PRODUTO

function carregarProdutoPromocao() {

    document
        .getElementById("categoriaProduto")
        .textContent =
        formatarCategoria(produtoPromocao.categoria);


    document
        .getElementById("nomeProduto")
        .textContent =
        produtoPromocao.nome;


    document
        .getElementById("precoOriginalProduto")
        .textContent =
        "De " + formatarPreco(produtoPromocao.preco);


    document
        .getElementById("precoPromocionalProduto")
        .textContent =
        "Por " +
        formatarPreco(
            produtoPromocao.precoPromocional
        );


    document
        .getElementById("descricaoProduto")
        .textContent =
        produtoPromocao.descricao || "";


    document
        .getElementById("descontoProduto")
        .textContent =
        `${produtoPromocao.desconto}% OFF`;


    const validade =
        document.getElementById("validadeProduto");


    if (produtoPromocao.validadePromocao) {

        validade.textContent =
            "Oferta válida até " +
            produtoPromocao.validadePromocao;

    } else {

        validade.textContent =
            "Oferta por tempo limitado";

    }


    carregarImagemPrincipal();

    carregarModelo();

    configurarTamanhosPromocao();

}


// CARREGA A IMAGEM PRINCIPAL

function carregarImagemPrincipal() {

    const imagemPrincipal =
        document.getElementById(
            "imagemPrincipal"
        );


    imagemPrincipal.src =
        produtoPromocao.imagem;

    imagemPrincipal.alt =
        produtoPromocao.nome;

}


// CARREGA O MODELO

function carregarModelo() {

    const nomeModelo =
        document.getElementById(
            "nomeModelo"
        );

    const especificacaoModelo =
        document.getElementById(
            "especificacaoModelo"
        );


    /*
        Se o produto possuir variações,
        utilizamos a primeira.

        Caso não possua, usamos os dados
        básicos do próprio produto.
    */

    if (
        produtoPromocao.variacoes &&
        produtoPromocao.variacoes.length > 0
    ) {

        criarMiniaturasPromocao();

    } else {

        nomeModelo.textContent =
            produtoPromocao.nome;

        especificacaoModelo.textContent =
            produtoPromocao.descricao || "";

    }

}


// CRIA AS MINIATURAS DAS VARIAÇÕES

function criarMiniaturasPromocao() {

    const area =
        document.getElementById(
            "miniaturas"
        );


    area.innerHTML = "";


    produtoPromocao.variacoes.forEach(
        function(variacao) {

            const imagem =
                document.createElement("img");


            imagem.src =
                variacao.imagem;

            imagem.alt =
                variacao.nome;


            imagem.dataset.nome =
                variacao.nome || produtoPromocao.nome;


            imagem.dataset.especificacao =
                variacao.especificacao || "";


            imagem.addEventListener(
                "click",
                function() {

                    trocarModeloPromocao(imagem);

                }
            );


            area.appendChild(imagem);

        }
    );


    const primeiraImagem =
        area.querySelector("img");


    if (primeiraImagem) {

        trocarModeloPromocao(
            primeiraImagem
        );

    }

}


// TROCA O MODELO SELECIONADO

function trocarModeloPromocao(imagem) {

    document
        .getElementById("imagemPrincipal")
        .src =
        imagem.src;


    document
        .getElementById("nomeModelo")
        .textContent =
        imagem.dataset.nome;


    document
        .getElementById("especificacaoModelo")
        .textContent =
        imagem.dataset.especificacao;


    const miniaturas =
        document.querySelectorAll(
            ".miniaturas img"
        );


    miniaturas.forEach(
        function(item) {

            item.classList.remove(
                "selecionada"
            );

        }
    );


    imagem.classList.add(
        "selecionada"
    );

}


// CONFIGURA TAMANHOS

function configurarTamanhosPromocao() {

    const area =
        document.getElementById(
            "areaTamanhos"
        );


    const tamanhos =
        document.getElementById(
            "tamanhos"
        );


    tamanhos.innerHTML = "";


    /*
        Caso futuramente algum produto
        tenha:

        temTamanho: true

        e:

        tamanhos: ["P", "M", "G"]

        os tamanhos serão criados
        automaticamente.
    */

    if (
        produtoPromocao.temTamanho === true &&
        Array.isArray(produtoPromocao.tamanhos)
    ) {

        area.style.display = "block";


        produtoPromocao.tamanhos.forEach(
            function(tamanho) {

                const botao =
                    document.createElement(
                        "button"
                    );


                botao.type = "button";

                botao.textContent =
                    tamanho;


                botao.addEventListener(
                    "click",
                    function() {

                        selecionarTamanhoPromocao(
                            botao
                        );

                    }
                );


                tamanhos.appendChild(
                    botao
                );

            }
        );

    } else {

        area.style.display = "none";

    }

}


// SELECIONA O TAMANHO

function selecionarTamanhoPromocao(botao) {

    const botoes =
        document.querySelectorAll(
            ".tamanhos button"
        );


    botoes.forEach(
        function(item) {

            item.classList.remove(
                "selecionado"
            );

        }
    );


    botao.classList.add(
        "selecionado"
    );

}