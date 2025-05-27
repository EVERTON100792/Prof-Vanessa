// Inicializa EmailJS (substitua com seu user ID)
emailjs.init('SEU_USER_ID_EMAILJS');

document.addEventListener('DOMContentLoaded', () => {
  const comprarBtns = document.querySelectorAll('.comprar-btn');
  const modal = document.getElementById('formulario-modal');
  const fecharBtn = modal.querySelector('.fechar-btn');
  const form = document.getElementById('form-compra');
  const produtoNomeElem = document.getElementById('produto-nome');
  const imagemProdutoElem = document.getElementById('imagem-produto');
  const searchInput = document.getElementById('search');
  const produtos = document.querySelectorAll('.produto');

  let produtoSelecionado = null; // Remanejei para manter, mas não usaremos no clique "Comprar"

  // Removi o código que abria o modal no clique comprar
  // Apenas adiciona produto ao carrinho abaixo

  // Array que guarda os produtos no carrinho
  const carrinho = [];
  const contadorCarrinho = document.getElementById('contador-carrinho');
  const listaCarrinho = document.getElementById('lista-carrinho');
  const carrinhoDetalhes = document.getElementById('carrinho-detalhes');
  const abrirCarrinho = document.getElementById('abrir-carrinho');
  const finalizarBtn = document.getElementById('finalizar-compra');

  // Ao clicar no botão comprar, adiciona ao carrinho
  comprarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const produto = btn.closest('.produto');
      const nome = produto.querySelector('h2').innerText;
      const preco = produto.querySelector('strong').innerText;

      carrinho.push({ nome, preco });
      atualizarCarrinho();
    });
  });

  // Função para atualizar o carrinho na interface
  function atualizarCarrinho() {
    contadorCarrinho.innerText = carrinho.length;
    listaCarrinho.innerHTML = '';
    carrinho.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.nome} - ${item.preco}`;
      listaCarrinho.appendChild(li);
    });
  }

  // Abrir/fechar detalhes do carrinho
  abrirCarrinho.addEventListener('click', () => {
    carrinhoDetalhes.classList.toggle('escondido');
  });

  // Quando clicar em finalizar, abrir o modal do formulário
  finalizarBtn.addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Ajusta título e esconde imagem (compra múltipla)
    produtoNomeElem.textContent = 'Compra de materiais pedagógicos';
    imagemProdutoElem.style.display = 'none';

    modal.classList.add('active');
  });

  // Fechar modal
  fecharBtn.addEventListener('click', () => {
    form.reset();
    modal.classList.remove('active');
    imagemProdutoElem.style.display = ''; // Voltar a mostrar a imagem quando fechar
  });

  // Envio do formulário com EmailJS
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.nome.value.trim() || !form.email.value.trim() || !form.comprovante.files.length) {
      alert('Por favor, preencha todos os campos e envie o comprovante.');
      return;
    }

    const file = form.comprovante.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];

      // Você pode juntar todos os nomes do carrinho para enviar
      const nomesProdutos = carrinho.map(item => item.nome).join(', ');

      const templateParams = {
        nome: form.nome.value,
        email: form.email.value,
        produto: nomesProdutos,
        comprovante: base64,
        nome_arquivo: file.name
      };

      emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', templateParams)
        .then(() => {
          alert('Comprovante enviado com sucesso! Aguarde a liberação do download.');
          form.reset();
          modal.classList.remove('active');
          imagemProdutoElem.style.display = '';

          // Limpa o carrinho após finalizar compra
          carrinho.length = 0;
          atualizarCarrinho();
          carrinhoDetalhes.classList.add('escondido');
        }, (error) => {
          alert('Erro ao enviar o comprovante. Tente novamente.');
          console.error(error);
        });
    };

    reader.readAsDataURL(file);
  });

  // Busca simples dos produtos
  searchInput.addEventListener('input', () => {
    const termo = searchInput.value.toLowerCase();
    produtos.forEach(prod => {
      const nome = prod.getAttribute('data-nome').toLowerCase();
      prod.style.display = nome.includes(termo) ? '' : 'none';
    });
  });

  // Comentários locais na tela
  document.querySelectorAll('.btn-comentar').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.comentarios');
      const input = container.querySelector('.campo-comentario');
      const lista = container.querySelector('.lista-comentarios');
      const texto = input.value.trim();
      if (texto) {
        const li = document.createElement('li');
        li.textContent = texto;
        lista.appendChild(li);
        input.value = '';
      }
    });
  });
});
document.querySelectorAll('.avaliacao').forEach(avaliacao => {
  const estrelas = avaliacao.querySelectorAll('.estrela');

  function atualizarVisual(valor) {
    estrelas.forEach((estrela, index) => {
      if (index < valor) {
        estrela.classList.add('filled');
      } else {
        estrela.classList.remove('filled');
      }
    });
  }

  // Recupera avaliação salva no localStorage, se existir
  const nomeProduto = avaliacao.closest('.produto').dataset.nome;
  const avaliacaoSalva = localStorage.getItem('avaliacao_' + nomeProduto);
  const valorInicial = avaliacaoSalva ? parseInt(avaliacaoSalva) : 0;
  avaliacao.setAttribute('data-valor', valorInicial);
  atualizarVisual(valorInicial);

  estrelas.forEach(estrela => {
    estrela.addEventListener('click', () => {
      const valor = parseInt(estrela.getAttribute('data-estrela'));
      avaliacao.setAttribute('data-valor', valor);
      atualizarVisual(valor);

      // Salva no localStorage para persistência
      localStorage.setItem('avaliacao_' + nomeProduto, valor);
    });

    estrela.addEventListener('mouseover', () => {
      const hoverValor = parseInt(estrela.getAttribute('data-estrela'));
      atualizarVisual(hoverValor);
    });

    estrela.addEventListener('mouseout', () => {
      const valorAtual = parseInt(avaliacao.getAttribute('data-valor'));
      atualizarVisual(valorAtual);
    });
  });
});
