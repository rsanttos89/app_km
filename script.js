// Obtém a data atual no formato YYYY-MM-DD
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Define o valor padrão como a data atual
document.getElementById('date-one').value = getCurrentDate();

// Abrir o input file
function openFileInput(inputId) {
  document.getElementById(inputId).click();
}

function compressImage(file, callback) {
  const reader = new FileReader();

  reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxWidth = 450;
          const maxHeight = 450;

          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
          }

          if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(function (blob) {
              const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg', // Adjust as needed
                  lastModified: Date.now(),
              });
              callback(compressedFile);
          }, 'image/jpeg', 0.5); // Adjust quality as needed
      };
  };

  reader.readAsDataURL(file);
}

function previewImage(fileInput, imagePreview) {
  let input = document.getElementById(fileInput);
  let preview = document.getElementById(imagePreview);

  let file = input.files[0];

  if (file) {
      compressImage(file, function (compressedFile) {
          let reader = new FileReader();
          reader.onload = function (e) {
              preview.src = e.target.result;
              preview.style.display = 'flex';
          };
          reader.readAsDataURL(compressedFile);
      });
  }
}

// ---------------------------------------------------------------------------
let count = 1;
let lastContainerType = 'entrada';

function createNewContainer() {
  const main = document.getElementById('main');
  count++;

  // Determina o tipo do novo container com base no container anterior
  const newContainerType = lastContainerType === 'entrada' ? 'saída' : 'entrada';
  lastContainerType = newContainerType;

  // Gera o valor da data atual
  const currentDate = getCurrentDate();

  // Cria um novo container
  const newContainer = document.createElement('div');
  newContainer.className = 'container container-img';

  newContainer.innerHTML = `
    <h3>${newContainerType} ${count}</h3>
    <button class="img container" onclick="openFileInput('fileInput${count}')">
      <span class="container" style="position: absolute; z-index: 1;">+</span>
      <input type="file" name="fileInput${count}" id="fileInput${count}" accept="image/*" style="display: none;" onchange="previewImage('fileInput${count}', 'imagePreview${count}')" />
      <img id="imagePreview${count}" src="#" alt="Imagem" style="display:none; z-index: 2;" class="image-preview" />
    </button>
    <input type="date" name="date" value="${currentDate}" />
  `;

  // Obtém uma referência para o botão
  const btnPrint = document.getElementById('card');

  // Adiciona o novo container antes do botão
  main.insertBefore(newContainer, btnPrint);
}

// ---------------------------------------------------------------------------
// Imprimir PDF
function printPDF() {
  window.print();
}
