function filtrarFAQ() {
  let input = document.getElementById("pesquisaFaq").value.toLowerCase();
  let perguntas = document.querySelectorAll(".pergunta");

  perguntas.forEach((pergunta) => {
    let texto = pergunta.innerText.toLowerCase();

    if (texto.includes(input)) {
      pergunta.style.display = "block";
    } else {
      pergunta.style.display = "none";
    }
  });
}
