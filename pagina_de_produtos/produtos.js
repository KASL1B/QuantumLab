import { produtos } from "../todos_produtos.js";

const lista_produtos =
  document.querySelector("#lista-produtos");


// VERIFICA SE A PROMOÇÃO AINDA ESTÁ VÁLIDA

function promocaoValida(produto) {

  if (produto.precoPromocional === undefined) {
    return false;
  }

  // Se não houver validade,
  // considera a promoção válida

  if (!produto.validadePromocao) {
    return true;
  }

  const partes =
    produto.validadePromocao.split("/");

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


// FORMATA O PREÇO

function formatarPreco(valor) {

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

}


// CRIA OS CARDS DOS PRODUTOS

produtos.forEach(produto => {

  const emPromocao =
    promocaoValida(produto);


  const card =
    document.createElement("div");

  card.className = "produto";

  card.dataset.categoria =
    produto.categoria;


  if (emPromocao) {

    card.innerHTML = `

      <span class="selo-desconto">
        ${produto.desconto}% OFF
      </span>

      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        loading="lazy"
      >

      <h2>
        ${produto.nome}
      </h2>

      <p class="preco-original">
        De ${formatarPreco(produto.preco)}
      </p>

      <p class="preco-promocional">
        ${formatarPreco(produto.precoPromocional)}
      </p>

      <button
        class="btn-comprar"
        data-id="${produto.id}"
        data-promocao="true"
      >
        Ver produto
      </button>

    `;

  } else {

    card.innerHTML = `

      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        loading="lazy"
      >

      <h2>
        ${produto.nome}
      </h2>

      <p>
        ${formatarPreco(produto.preco)}
      </p>

      <button
        class="btn-comprar"
        data-id="${produto.id}"
        data-promocao="false"
      >
        Ver produto
      </button>

    `;

  }


  lista_produtos.appendChild(card);

});


// ABRIR CATEGORIAS

window.abrirCategorias =
  function abrirCategorias() {

    const menu =
      document.getElementById(
        "menuCategorias"
      );

    if (menu.style.display === "flex") {

      menu.style.display = "none";

    } else {

      menu.style.display = "flex";

    }

  };


// FILTRAR POR CATEGORIA

window.filtrarCategorias =
  function filtrarCategorias(categoria) {

    const produtosCards =
      document.querySelectorAll(".produto");


    produtosCards.forEach(card => {

      if (
        categoria === "todos" ||
        card.dataset.categoria === categoria
      ) {

        card.style.display = "block";

      } else {

        card.style.display = "none";

      }

    });

  };


// PESQUISA

window.filtrarProdutos =
  function filtrarProdutos() {

    const pesquisa =
      document
        .getElementById("pesquisa")
        .value
        .toLowerCase();


    const produtosCards =
      document.querySelectorAll(".produto");


    produtosCards.forEach(card => {

      const texto =
        card.innerText.toLowerCase();


      if (texto.includes(pesquisa)) {

        card.style.display = "block";

      } else {

        card.style.display = "none";

      }

    });

  };


// BOTÃO VER PRODUTO

document.addEventListener(
  "click",
  evento => {

    const botao =
      evento.target.closest(
        ".btn-comprar"
      );


    if (!botao) {
      return;
    }


    const id =
      botao.dataset.id;


    const emPromocao =
      botao.dataset.promocao === "true";


    if (emPromocao) {

      window.location.href =
        `../pagina_de_promocao/compra_promocao.html?id=${id}`;

    } else {

      window.location.href =
        `../pagina_de_compra/compra.html?id=${id}`;

    }

  }
);