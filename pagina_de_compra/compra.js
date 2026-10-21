import { produtos } from "../todos_produtos.js";

const parametros = new URLSearchParams(window.location.search);

const id = Number(parametros.get("id")) || 1;

const produto =
produtos.find(item => item.id === id) ||
produtos[0];

carregarProduto();

function carregarProduto() {


document.getElementById("categoria_produto").textContent =
    produto.categoria;

document.getElementById("nome_produto").textContent =
    produto.nome;

document.getElementById("preco_produto").textContent =
    Number(produto.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

document.getElementById("descricao_produto").textContent =
    produto.descricao;

criarMiniaturas();
configurarTamanhos();


}

function criarMiniaturas() {


const area = document.getElementById("miniaturas");

area.innerHTML = "";

if (!produto.variacoes || produto.variacoes.length === 0) {

    const imagem = document.createElement("img");

    imagem.src = produto.imagem;
    imagem.alt = produto.nome;

    imagem.dataset.nome = produto.nome;
    imagem.dataset.especificacao =
        produto.descricao || "";

    imagem.onclick = function() {
        trocarModelo(imagem);
    };

    area.appendChild(imagem);

} else {

    produto.variacoes.forEach(function(variacao) {

        const imagem = document.createElement("img");

        imagem.src = variacao.imagem;
        imagem.alt = variacao.nome;

        imagem.dataset.nome = variacao.nome;
        imagem.dataset.especificacao =
            variacao.especificacao || "";

        imagem.onclick = function() {
            trocarModelo(imagem);
        };

        area.appendChild(imagem);
    });
}

const primeiraImagem =
    area.querySelector("img");

if (primeiraImagem) {
    trocarModelo(primeiraImagem);
}


}

function trocarModelo(imagem) {


document.getElementById("imagem_principal").src =
    imagem.src;

document.getElementById("nome_modelo").textContent =
    imagem.dataset.nome;

document.getElementById("especificacao_modelo").textContent =
    imagem.dataset.especificacao;

const miniaturas =
    document.querySelectorAll(".miniaturas img");

miniaturas.forEach(function(item) {

    item.classList.remove("selecionada");

});

imagem.classList.add("selecionada");


}

function configurarTamanhos() {


const area =
    document.getElementById("area_tamanhos");

const tamanhos =
    document.getElementById("tamanhos");

tamanhos.innerHTML = "";

if (
    produto.temTamanho === true &&
    produto.tamanhos
) {

    area.style.display = "block";

    produto.tamanhos.forEach(function(tamanho) {

        const botao =
            document.createElement("button");

        botao.textContent = tamanho;

        botao.onclick = function() {
            selecionarTamanho(botao);
        };

        tamanhos.appendChild(botao);
    });

} else {

    area.style.display = "none";
}


}

function selecionarTamanho(botao) {


const botoes =
    document.querySelectorAll(".tamanhos button");

botoes.forEach(function(item) {

    item.classList.remove("selecionado");

});

botao.classList.add("selecionado");


}
