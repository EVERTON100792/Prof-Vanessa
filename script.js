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

  let produtoSelecionado = null;

  // Abrir modal e preencher dados do produto
  comprarBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      produtoSelecionado = produtos[i];
      const nome = produtoSelecionado.querySelector('h2').textContent;
      const imgSrc = produtoSelecionado.querySelector('img').src;
      produtoNomeElem.textContent = 'Produto: ' + nome;
      imagemProdutoElem.src = imgSrc;
      modal.classList.add('active');
    });
  });

  // Fechar modal
  fecharBtn.addEventListener('click', () => {
    form.reset();
    modal.classList.remove('active');
  });

  // Envio do formulário com EmailJS
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar campos básicos
    if (!form.nome.value.trim() || !form.email.value.trim() || !form.comprovante.files.length) {
      alert('Por favor, preencha todos os campos e envie o comprovante.');
      return;
    }

    // Preparar dados para envio
    const formData = new FormData(form);
    const file = form.comprovante.files[0];

    // Converter arquivo para base64 para enviar pelo emailjs
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // pega só a parte do base64

      // Parâmetros que vamos enviar para EmailJS (ajuste os nomes no template do EmailJS)
      const templateParams = {
        nome: form.nome.value,
        email: form.email.value,
        produto: produtoSelecionado.querySelector('h2').textContent,
        comprovante: base64,
        nome_arquivo: file.name
      };

      // Enviar email
      emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', templateParams)
        .then(() => {
          alert('Comprovante enviado com sucesso! Aguarde a liberação do download.');
          form.reset();
          modal.classList.remove('active');
          // Aqui você pode adicionar lógica para salvar a compra para liberar o download depois
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
      if (nome.includes(termo)) {
        prod.style.display = '';
      } else {
        prod.style.display = 'none';
      }
    });
  });

  // Comentários locais (na tela)
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
