// Inicialização do EmailJS (substitua com sua chave pública)
emailjs.init("SEU_USER_ID_DO_EMAILJS");

const carrinho = [];
const listaCarrinho = document.getElementById("lista-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");
const carrinhoDetalhes = document.getElementById("carrinho-detalhes");
const abrirCarrinho = document.getElementById("abrir-carrinho");
const finalizarCompra = document.getElementById("finalizar-compra");
const formularioModal = document.getElementById("formulario-modal");
const formCompra = document.getElementById("form-compra");
const produtoNome = document.getElementById("produto-nome");
const imagemProduto = document.getElementById("imagem-produto");

const produtos = document.querySelectorAll(".produto");

produtos.forEach((produto) => {
  const nome = produto.dataset.nome;
  const preco = parseFloat(produto.querySelector("strong").textContent.replace("R$ ", "").replace(",", "."));
  const imagem = produto.querySelector("img").src;

  produto.querySelector(".comprar-btn").addEventListener("click", () => {
    carrinho.push({ nome, preco, imagem });
    atualizarCarrinho();
  });
});

function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2).replace(".", ",")}`;
    listaCarrinho.appendChild(li);
    total += item.preco;
  });

  const totalLi = document.createElement("li");
  totalLi.innerHTML = `<strong>Total: R$ ${total.toFixed(2).replace(".", ",")}</strong><br/><img src="qrcode-pix.png" alt="QR Code Pix" style="margin-top:10px;width:150px;"> <p style="font-size:14px;">Escaneie o QR Code para pagar via Pix.</p>`;
  listaCarrinho.appendChild(totalLi);

  contadorCarrinho.textContent = carrinho.length;
}

abrirCarrinho.addEventListener("click", () => {
  carrinhoDetalhes.classList.toggle("escondido");
});

finalizarCompra.addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  // Mostra o formulário com o primeiro produto (ou adapte para todos)
  const produto = carrinho[0];
  produtoNome.textContent = `Produto: ${produto.nome}`;
  imagemProduto.src = produto.imagem;
  formularioModal.style.display = "block";
});

// Fechar formulário
document.querySelector(".fechar-btn").addEventListener("click", () => {
  formularioModal.style.display = "none";
});

// Envio do formulário
formCompra.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(formCompra);
  const nome = formData.get("nome");
  const email = formData.get("email");
  const comprovante = formData.get("comprovante");

  if (!comprovante) {
    alert("Por favor, envie o comprovante.");
    return;
  }

  emailjs.sendForm("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", this).then(
    function () {
      alert("Compra finalizada com sucesso! Você receberá os materiais em breve.");
      formularioModal.style.display = "none";
      formCompra.reset();
      carrinho.length = 0;
      atualizarCarrinho();
    },
    function (error) {
      alert("Erro ao enviar. Tente novamente.");
      console.error("Erro:", error);
    }
  );
});
function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");

    // Texto do item
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2).replace(".", ",")}`;

    // Botão remover
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.style.marginLeft = "10px";
    btnRemover.style.cursor = "pointer";
    btnRemover.addEventListener("click", () => {
      carrinho.splice(index, 1);
      atualizarCarrinho();
    });

    li.appendChild(btnRemover);
    listaCarrinho.appendChild(li);

    total += item.preco;
  });

  if (carrinho.length > 0) {
    const totalLi = document.createElement("li");
    totalLi.innerHTML = `<strong>Total: R$ ${total.toFixed(2).replace(".", ",")}</strong><br/>
      <img src="qrcode-pix.png" alt="QR Code Pix" style="margin-top:10px;width:150px;"> 
      <p style="font-size:14px;">Escaneie o QR Code para pagar via Pix.</p>`;
    listaCarrinho.appendChild(totalLi);
  }

  contadorCarrinho.textContent = carrinho.length;
}

// Pesquisa de produtos
const campoBusca = document.getElementById("search");

campoBusca.addEventListener("input", () => {
  const termo = campoBusca.value.toLowerCase();

  produtos.forEach(produto => {
    const nome = produto.dataset.nome.toLowerCase();
    const titulo = produto.querySelector("h2").textContent.toLowerCase();

    if (nome.includes(termo) || titulo.includes(termo)) {
      produto.style.display = "block";
    } else {
      produto.style.display = "none";
    }
  });
});
