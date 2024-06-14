const apiUrl = "https://localhost:3000";

const especialidades = document.getElementById("especialidades");
const formulario = document.getElementById("form_select");
const profesionales = document.getElementById("profesionales");
const profesional_1 = document.getElementById("profesional_1");
const profesional_2 = document.getElementById("profesional_2");
const datepicker = document.getElementById("datepicker");
const btnSubmit = document.getElementById("btn-submit");
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const modalMessage = document.getElementById("modalMessage")

let fechasOdontologia = [];
let fechasTraumatologia = [];
let fechasDermatologia = [];
let fechasRadiologia = [];
let profesionalesOdontologia = [];
let profesionalesTraumatologia = [];
let profesionalesDermatologia = [];
let profesionalesRadiologia = [];
let prof1 = profesionalesOdontologia[0];
async function cargarEspecialidades() {
  const response = await fetch(`${apiUrl}/especialidades`);
  const especialidades = await response.json();
  for (let especialidad of especialidades) {
    if (especialidad.especialidad === "Odontologia") {
      for (let fecha of especialidad.turnos) {
        fechasOdontologia.push(fecha);
      }
      for (let profesional of especialidad.profesionales) {
        profesionalesOdontologia.push(profesional);
      }
    }
    if (especialidad.especialidad === "Traumatologia") {
      for (let fecha of especialidad.turnos) {
        fechasTraumatologia.push(fecha);
      }
      for (let profesional of especialidad.profesionales) {
        profesionalesTraumatologia.push(profesional);
      }
    }
    if (especialidad.especialidad === "Dermatologia") {
      for (let fecha of especialidad.turnos) {
        fechasDermatologia.push(fecha);
      }
      for (let profesional of especialidad.profesionales) {
        profesionalesDermatologia.push(profesional);
      }
    }
    if (especialidad.especialidad === "Radiologia") {
      for (let fecha of especialidad.turnos) {
        fechasRadiologia.push(fecha);
      }
      for (let profesional of especialidad.profesionales) {
        profesionalesRadiologia.push(profesional);
      }
    }
  }
}
cargarEspecialidades();

function convertirFechas(fechas) {
  return fechas.map((fecha) => new Date(fecha));
}
function convertirFechaFormato(fecha) {
  let partes = fecha.split('/');
  let día = partes[0];
  let mes = partes[1];
  let año = partes[2];

  let nuevaFecha = `${año}/${mes}/${día}`;

  return nuevaFecha;
}

document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#datepicker", {
    enable: convertirFechas(fechasOdontologia),
    locale: "es",
    dateFormat: "j/n/Y",
  });
});

especialidades.addEventListener("change", (event) => {
  let opcionElegida = event.target.value;
  switch (opcionElegida) {
    case "Odontologia":
      profesional_1.textContent = profesionalesOdontologia[0];
      profesional_1.style.display = "block";
      profesional_2.textContent = profesionalesOdontologia[1];
      profesional_2.style.display = "block";
      datepicker.value = "";
      flatpickr("#datepicker", {
        enable: convertirFechas(fechasOdontologia),
        locale: "es",
        dateFormat: "j/n/Y",
      });
      break;
    case "Traumatologia":
      profesional_1.textContent = profesionalesTraumatologia[0];
      profesional_1.style.display = "block";
      profesional_2.textContent = profesionalesTraumatologia[1];
      profesional_2.style.display = "block";
      datepicker.value = "";
      flatpickr("#datepicker", {
        enable: convertirFechas(fechasTraumatologia),
        locale: "es",
        dateFormat: "j/n/Y",
      });
      break;
    case "Dermatologia":
      profesional_1.textContent = profesionalesDermatologia[0];
      profesional_1.style.display = "block";
      profesional_2.textContent = profesionalesDermatologia[1];
      profesional_2.style.display = "block";
      datepicker.value = "";
      flatpickr("#datepicker", {
        enable: convertirFechas(fechasDermatologia),
        locale: "es",
        dateFormat: "j/n/Y",
      });
      break;
    case "Radiologia":
      profesional_1.textContent = profesionalesRadiologia[0];
      profesional_1.style.display = "block";
      profesional_2.textContent = profesionalesRadiologia[1];
      profesional_2.style.display = "block";
      datepicker.value = "";
      flatpickr("#datepicker", {
        enable: convertirFechas(fechasRadiologia),
        locale: "es",
        dateFormat: "j/n/Y",
      });
      break;
    default:
      profesional_1.style.display = "none";
      profesional_2.style.display = "none";
      profesional_1.textContent = "Seleccionar";
      profesional_2.textContent = "Seleccionar";
      datepicker.value = "";
      flatpickr("#datepicker", {
        enable: [new Date()],
        locale: "es",
        dateFormat: "j/n/Y",
      });
      break;
  }
});

btnSubmit.addEventListener("click", async function (event) {
  event.preventDefault();
  const especialidad = especialidades.value;
  const fechaSelect = datepicker.value;
  const profesional = profesionales.value;
  if (especialidad == "Seleccionar") {
    document.getElementById("error_select").style.display = "block";
  } else {
    document.getElementById("error_select").style.display = "none";
  }
  if (profesional == "Seleccionar") {
    document.getElementById("error_select2").style.display = "block";
  } else {
    document.getElementById("error_select2").style.display = "none";
  }
  if (!fechaSelect) {
    document.getElementById("error_select3").style.display = "block";
  } else {
    document.getElementById("error_select3").style.display = "none";
  }
  if (
    especialidad !== "Seleccionar" &&
    fechaSelect &&
    profesional !== "Seleccionar"
  ) {
    document.getElementById("error_select").style.display = "none";
    document.getElementById("error_select2").style.display = "none";
    const fecha = convertirFechaFormato(fechaSelect);
    try {
      const response = await fetch(
        `${apiUrl}/especialidades/${especialidad}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fecha, profesional }),
        }
      );

      const resultado = await response.json();
      btnSubmit.textContent = "Reservando turno...";

      setTimeout(() => {
        if(!response.ok){
          modalMessage.textContent = "Turno ya reservado, seleccione otro disponible";
          modal.style.display = "block";
        }
        else{
          modalMessage.textContent = "Turno reservado correctamente!";
          modal.style.display = "block";
        }
        btnSubmit.textContent = "Reservar turno";
      }, 2000);
    
    } catch (error) {
      console.error("Error:", error);
      modalMessage.textContent = "Error al reservar el turno. Por favor, inténtelo de nuevo.";
      modal.style.display = "block";
    }
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
});