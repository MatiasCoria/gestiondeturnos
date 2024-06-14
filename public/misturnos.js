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

let fechasOdontologia = [];
let fechasTraumatologia = [];
let fechasDermatologia = [];
let fechasRadiologia = [];
let profesionalesOdontologia = [];
let profesionalesTraumatologia = [];
let profesionalesDermatologia = [];
let profesionalesRadiologia = [];
let currentTurnoId = null;
let currentEspecialidad = null;
let currentEspecialidadTurnos = null;

async function cargarEspecialidades() {
  const response = await fetch(`${apiUrl}/especialidades`);
  const especialidades = await response.json();
  for (let especialidad of especialidades) {
    if (especialidad.especialidad === "Odontologia") {
      fechasOdontologia.push(...especialidad.turnos);
      profesionalesOdontologia.push(...especialidad.profesionales);
    } else if (especialidad.especialidad === "Traumatologia") {
      fechasTraumatologia.push(...especialidad.turnos);
      profesionalesTraumatologia.push(...especialidad.profesionales);
    } else if (especialidad.especialidad === "Dermatologia") {
      fechasDermatologia.push(...especialidad.turnos);
      profesionalesDermatologia.push(...especialidad.profesionales);
    } else if (especialidad.especialidad === "Radiologia") {
      fechasRadiologia.push(...especialidad.turnos);
      profesionalesRadiologia.push(...especialidad.profesionales);
    }
  }
}
cargarEspecialidades();

function convertirFechas(fechas) {
  return fechas.map((fecha) => new Date(fecha));
}

function convertirFechaFormato(fecha) {
  let [día, mes, año] = fecha.split("/");
  return `${año}/${mes}/${día}`;
}

document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#datepicker", {
    enable: convertirFechas(fechasOdontologia),
    locale: "es",
    dateFormat: "j/n/Y",
  });
});

function convertirFecha(fecha) {
  let [año, mes, día] = fecha.split("/");
  return `${día}/${mes}/${año}`;
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

function actualizarProfesionalesYFechas(especialidad) {
  let profesionales = [];
  let fechas = [];
  switch (especialidad) {
    case "Odontologia":
      profesionales = profesionalesOdontologia;
      fechas = fechasOdontologia;
      break;
    case "Traumatologia":
      profesionales = profesionalesTraumatologia;
      fechas = fechasTraumatologia;
      break;
    case "Dermatologia":
      profesionales = profesionalesDermatologia;
      fechas = fechasDermatologia;
      break;
    case "Radiologia":
      profesionales = profesionalesRadiologia;
      fechas = fechasRadiologia;
      break;
  }
  profesional_1.textContent = profesionales[0];
  profesional_1.style.display = "block";
  profesional_2.textContent = profesionales[1];
  profesional_2.style.display = "block";
  datepicker.value = "";
  flatpickr("#datepicker", {
    enable: convertirFechas(fechas),
    locale: "es",
    dateFormat: "j/n/Y",
  });
}

async function modificarTurno(id, especialidadid, especialidadTurnos) {
  currentTurnoId = id;
  currentEspecialidad = especialidadid;
  currentEspecialidadTurnos = especialidadTurnos;

  actualizarProfesionalesYFechas(especialidadTurnos);

  btnSubmit.textContent = "Guardar cambios";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
}

btnSubmit.addEventListener("click", async function (event) {
  event.preventDefault();

  const especialidadElegida = currentEspecialidad;
  const especialidad = currentEspecialidadTurnos;
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
        `${apiUrl}/historial/${especialidadElegida}/${currentTurnoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ especialidad, fecha, profesional }),
        }
      );

      btnSubmit.textContent = "Guardando turno..";
      setTimeout(() => {
        btnSubmit.textContent = "Turno guardado!";
      }, 1500);
      setTimeout(() => {
        cargarHistorial();
        modal.style.display = "none";
      }, 2500);
    } catch (error) {
      console.error("Error al modificar el turno:", error);
    }
  }
});

function cerrarModal() {
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
