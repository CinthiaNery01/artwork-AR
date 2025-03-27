// Inicialize o Supabase com a URL do projeto e a chave pública
const supabaseUrl = 'https://whhadjkaihpsgifejbco.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaGFkamthaWhwc2dpZmVqYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDQzODAsImV4cCI6MjA1ODYyMDM4MH0.0M9IhtkUdGGbqyK_5ubdK1RNgWosKjJbgUnQGXu4Xn4';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);


// Configuração do EmailJS
emailjs.init('SUA_CHAVE_PUBLICA_EMAILJS'); // Substitua pela sua chave pública do EmailJS

const canvas = new fabric.Canvas('canvas');
canvas.setWidth(500);
canvas.setHeight(500);

// Função para carregar imagens do Supabase
async function carregarImagens() {
  const { data, error } = await supabase.storage.from('artwork').list();

  if (error) {
    console.error("Erro ao carregar imagens do Supabase:", error);
    return;
  }

  const imageGallery = document.getElementById('image-gallery');
  imageGallery.innerHTML = ''; // Limpar galeria existente

  data.forEach((image) => {
    const imageUrl = supabase.storage.from('artwork').getPublicUrl(image.name).publicURL;

    const imgElement = document.createElement('img');
    imgElement.classList.add('image-item');
    imgElement.src = imageUrl;
    imgElement.alt = image.name;

    imageGallery.appendChild(imgElement);
  });
}

// Carregar imagens ao carregar a página
window.onload = carregarImagens;

// Função para editar a imagem no canvas
document.querySelectorAll(".image-item").forEach((imageElement) => {
  imageElement.addEventListener("click", async () => {
    const imageUrl = imageElement.src;
    fabric.Image.fromURL(imageUrl, (img) => {
      img.set({ left: 0, top: 0 });
      canvas.clear();
      canvas.add(img);
    });
  });
});

// Exibir AR
document.getElementById("continuar-button").addEventListener("click", () => {
  const editedImageUrl = canvas.toDataURL(); // Obtém a imagem editada no canvas como Data URL

  // Atualiza a imagem no AR com a imagem editada
  document.getElementById("ar-image").setAttribute("src", editedImageUrl);

  // Ocultar o canvas de edição
  document.getElementById('canvas').style.display = 'none';

  // Mostrar botões "Voltar" e "Enviar por Email"
  document.getElementById('voltar-button').style.display = 'inline-block';
  document.getElementById('enviar-email-button').style.display = 'inline-block';
});

// Função para voltar à tela de edição
document.getElementById("voltar-button").addEventListener("click", () => {
  // Ocultar AR
  document.querySelector('a-scene').style.display = 'none';

  // Exibir o canvas de edição novamente
  document.getElementById('canvas').style.display = 'block';

  // Esconder o botão "Voltar" e "Enviar por Email"
  document.getElementById('voltar-button').style.display = 'none';
  document.getElementById('enviar-email-button').style.display = 'none';
});

// Enviar a imagem editada por email
document.getElementById("enviar-email-button").addEventListener("click", () => {
  const editedImageUrl = canvas.toDataURL('image/jpeg'); // Converter a imagem editada para JPEG

  // Enviar email com a imagem
  const templateParams = {
    to_email: 'email_do_destinatario@example.com', // Email do destinatário
    subject: 'Sua Imagem Editada',
    message: 'Aqui está sua imagem editada!',
    image: editedImageUrl, // Enviar a imagem como base64
  };

  // Enviar o email usando EmailJS
  emailjs.send('seu_servico_id', 'seu_template_id', templateParams)
    .then((response) => {
      console.log('Email enviado com sucesso:', response);
      document.getElementById('email-status').innerHTML = 'Seu email foi enviado com sucesso!';
    }, (error) => {
      console.log('Erro ao enviar o email:', error);
      document.getElementById('email-status').innerHTML = 'Houve um erro ao enviar o email. Tente novamente.';
    });
});
