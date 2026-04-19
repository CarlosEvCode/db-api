// --- Referencias al DOM ---
const raceSelect = document.getElementById("race-select");
const btnSearch = document.getElementById("btn-search");
const tableBody = document.querySelector("#characters-table tbody");

const imageContainer = document.getElementById("image-container");
const modalImage = document.getElementById("modal-image");

const detailContainer = document.getElementById("detail-container");
const modalDetail = document.getElementById("modal-detail");

const transSelect = document.getElementById("transformations-select");
const btnTrans = document.getElementById("button-transformacion");
const lblTrans = document.getElementById("lbl-trans");

// Estado y Configuración
let currentTransformations = [];
const races = [
  "Human",
  "Saiyan",
  "Namekian",
  "Majin",
  "Frieza Race",
  "Android",
  "Jiren Race",
  "God",
  "Angel",
  "Evil",
  "Nucleico",
  "Nucleico benigno",
  "Unknown",
];

// Inicialización
races.forEach((race) => {
  const option = document.createElement("option");
  option.value = race;
  option.textContent = race;
  raceSelect.appendChild(option);
});

// Event Listeners
btnSearch.addEventListener("click", () => {
  obtenerCharactersPorRaza(raceSelect.value);
});

btnTrans.addEventListener("click", () => {
  mostrarModalTransformacion(transSelect.value);
});

imageContainer.addEventListener("click", () => {
  imageContainer.style.display = "none";
});

// Funciones
function obtenerCharactersPorRaza(raza) {
  if (!raza) return alert("Por favor, selecciona una raza");

  fetch(
    `https://dragonball-api.com/api/characters?race=${encodeURIComponent(raza)}&limit=10`,
  )
    .then((res) => res.json())
    .then((data) => {
      tableBody.innerHTML = "";
      const characters = Array.isArray(data) ? data : data.items || [];

      characters.forEach((char) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${char.name}</td><td>${char.ki}</td><td>${char.gender}</td>`;

        // Botón Imagen
        const tdImg = document.createElement("td");
        const bImg = document.createElement("button");
        bImg.textContent = "Ver Imagen";
        bImg.addEventListener("click", () => mostrarImagen(char.image));
        tdImg.appendChild(bImg);
        row.appendChild(tdImg);

        // Botón Detalle
        const tdDet = document.createElement("td");
        const bDet = document.createElement("button");
        bDet.textContent = "Ver Detalle";
        bDet.addEventListener("click", () => mostrarDetalle(char.id));
        tdDet.appendChild(bDet);
        row.appendChild(tdDet);

        tableBody.appendChild(row);
      });
    })
    .catch((err) => console.error("Error al buscar personajes:", err));
}

function mostrarImagen(url) {
  modalImage.src = url;
  imageContainer.style.display = "flex";
}

function mostrarDetalle(id) {
  fetch(`https://dragonball-api.com/api/characters/${id}`)
    .then((res) => res.json())
    .then((data) => {
      // Actualizar información básica
      modalDetail.innerHTML = `
              <strong>Nombre:</strong> ${data.name}<br>
              <strong>Ki:</strong> ${data.ki}<br>
              <strong>Raza:</strong> ${data.race}<br>
              <strong>Descripción:</strong> ${data.description}
            `;

      // Gestionar transformaciones
      currentTransformations = data.transformations || [];
      const tieneTransformaciones = currentTransformations.length > 0;

      if (tieneTransformaciones) {
        llenarSelectTransformaciones(currentTransformations);
        transSelect.style.display = "inline-block";
        btnTrans.style.display = "inline-block";
        lblTrans.style.display = "inline-block";
      } else {
        transSelect.style.display = "none";
        btnTrans.style.display = "none";
        lblTrans.style.display = "none";
      }

      detailContainer.style.display = "block";
      // Mostrar imagen por defecto del personaje al abrir detalle
      mostrarImagen(data.image);
    })
    .catch((err) => console.error("Error al obtener detalles:", err));
}

function llenarSelectTransformaciones(list) {
  transSelect.innerHTML =
    '<option value="">Selecciona una transformación</option>';
  list.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name;
    transSelect.appendChild(opt);
  });
}

function mostrarModalTransformacion(id) {
  if (!id) return;
  const trans = currentTransformations.find((t) => t.id == id);
  if (trans) {
    // Actualizar imagen y texto
    modalImage.src = trans.image;
    modalDetail.innerHTML = `
            <strong>Transformación:</strong> ${trans.name}<br>
            <strong>Ki:</strong> ${trans.ki}<br>`;
  }
}
