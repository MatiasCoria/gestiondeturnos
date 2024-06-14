const apiUrl = "https://gestiondeturnos.onrender.com";
const turnoContainer = document.getElementById("tbody-container");
const especialidades = document.getElementById("especialidades");
const formulario = document.getElementById("form_select2");
const profesionales = document.getElementById("profesionales");
const profesional_1 = document.getElementById("profesional_1");
const profesional_2 = document.getElementById("profesional_2");
const datepicker = document.getElementById("datepicker");
const btnSubmit = document.getElementById("btn-submit2");
const btn = document.getElementById("openModalBtn");
const span = document.getElementsByClassName("close")[0];
const modal = document.getElementById("modal-misturnos");

let profesionalSubmit = "";
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
  let partes = fecha.split("/");
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

function convertirFecha(fecha) {
  let partes = fecha.split("/");
  let año = partes[0];
  let mes = partes[1];
  let día = partes[2];

  let nuevaFecha = `${día}/${mes}/${año}`;
  return nuevaFecha;
}

async function eliminarTurno(id) {
  try {
    const response = await fetch(`${apiUrl}/historial/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const trId = document.getElementById(id);
      if (trId) {
        trId.remove();
      }
      console.log("Turno eliminado exitosamente.");
      await cargarHistorial();
    } else {
      console.error("Error al eliminar el turno:", response.statusText);
    }
  } catch (error) {
    console.error("Error al eliminar el turno:", error);
  }
}

async function modificarTurno(
  id,
  especialidadid,
  especialidadTurnos
) {
  switch (especialidadTurnos) {
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

  btnSubmit.addEventListener("click", async function (event) {
    event.preventDefault();
    const especialidadElegida = especialidadid;
    const especialidad = especialidadTurnos;
    const fechaSelect = datepicker.value;
    const profesional = profesionales.value;
    const fecha = convertirFechaFormato(fechaSelect);
    if (profesional == "Seleccionar") {
      document.getElementById("error_select5").style.display = "block";
    } else {
      document.getElementById("error_select5").style.display = "none";
    }
    if (!fechaSelect) {
      document.getElementById("error_select4").style.display = "block";
    } else {
      document.getElementById("error_select4").style.display = "none";
    }
    if (fechaSelect && profesional !== "Seleccionar") {
      document.getElementById("error_select4").style.display = "none";
      document.getElementById("error_select5").style.display = "none";
      try {
        const response = await fetch(
          `${apiUrl}/historial/${especialidadElegida}/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ especialidad, fecha, profesional }),
          }
        );
        const resultado = await response.json();
        
        btnSubmit.textContent = "Guardando turno..";
        setTimeout(() => {
          btnSubmit.textContent = "Turno guardado!";
        }, 1500);
        setTimeout(() => {
          cargarHistorial();
          modal.style.display = "none";
        }, 2500);
      } catch (error) {}
    }
  });
  btnSubmit.textContent = "Guardar cambios";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
}

function cerrarModal() {
  const modal = document.getElementById("modal-misturnos");
  modal.style.display = "none";
}

async function cargarHistorial() {
  try {
    const response = await fetch(`${apiUrl}/historial`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const historial = await response.json();
    turnoContainer.innerHTML = "";
    historial.forEach((turno) => {
      const fechaTurno = document.createElement("td");
      const nombreTurno = document.createElement("td");
      const especialidadTurno = document.createElement("td");
      const accionesTurno = document.createElement("td");
      const fechaConvertida = convertirFecha(turno.fecha);
      fechaTurno.textContent = fechaConvertida;
      fechaTurno.id = fechaTurno.textContent;
      nombreTurno.textContent = turno.profesional;
      nombreTurno.id = nombreTurno.textContent;
      especialidadTurno.textContent = turno.especialidad;
      especialidadTurno.id = especialidadTurno.textContent;
      const btnEliminar = document.createElement("button");
      btnEliminar.id = "btn-eliminar";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () => eliminarTurno(turno._id));
      const btnModificar = document.createElement("button");
      btnModificar.textContent = "Modificar";
      btnModificar.classList.add(`btn-modificar`);
      btnModificar.addEventListener("click", () =>
        modificarTurno(
          turno._id,
          especialidadTurno.id,
          especialidadTurno.textContent
        )
      );
      accionesTurno.appendChild(btnModificar);
      accionesTurno.appendChild(btnEliminar);

      const turnoIndividual = document.createElement("tr");
      turnoIndividual.id = turno._id;
      turnoIndividual.appendChild(fechaTurno);
      turnoIndividual.appendChild(nombreTurno);
      turnoIndividual.appendChild(especialidadTurno);
      turnoIndividual.appendChild(accionesTurno);
      turnoContainer.appendChild(turnoIndividual);
    });
  } catch (error) {
    console.error("Error al cargar el historial:", error);
  }
}

cargarHistorial();
