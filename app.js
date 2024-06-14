const express = require("express");
const mongoose = require("mongoose");
const Turno = require("./models/turnos.model");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let especialidades = [
  {
    especialidad: "Odontologia",
    id: 1,
    profesionales: ["Lucas Garcia", "Marcela Balcarce"],
  },
  {
    especialidad: "Traumatologia",
    id: 2,
    profesionales: ["Esteban Santillan", "Pedro Samid"],
  },
  {
    especialidad: "Dermatologia",
    id: 3,
    profesionales: ["Julieta Ramallo", "Gabriel Duca"],
  },
  {
    especialidad: "Radiologia",
    id: 4,
    profesionales: ["German Bautista", "Faustina Perez"],
  },
];

// Agregar turnos aleatorios a las especialidades
especialidades.forEach((especialidad) => {
  especialidad.turnos = [];
  for (let i = 0; i < 4; i++) {
    const fecha = new Date();
    const rangoDeFechas = Math.floor(Math.random() * 30) + 1;
    fecha.setDate(fecha.getDate() + rangoDeFechas);
    const fechaFormateada = `${fecha.getFullYear()}/${
      fecha.getMonth() + 1
    }/${fecha.getDate()}`;
    especialidad.turnos.push(fechaFormateada);
  }
});

// Ruta de inicio
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Obtener lista de especialidades
app.get("/especialidades", (req, res) => {
  res.json(especialidades);
});

// Obtener turnos de una especialidad
app.get("/especialidades/:especialidad", (req, res) => {
  const especialidad = especialidades.find(
    (e) => e.especialidad === req.params.especialidad
  );
  if (!especialidad) {
    return res.status(404).json({ mensaje: "Especialidad no encontrada" });
  }
  res.json(especialidad);
});

// Sacar turno
app.post("/especialidades/:especialidad", async (req, res) => {
  try {
    const especialidad = req.params.especialidad;
    const { fecha, profesional } = req.body; 
    const especialidadEncontrada = especialidades.find(
      (e) => e.especialidad === especialidad
    );
    if (!especialidadEncontrada || !especialidadEncontrada.turnos.includes(fecha)) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }
    await Turno.create({ especialidad, fecha, profesional });

    especialidadEncontrada.turnos = especialidadEncontrada.turnos.filter((turno) => turno !== fecha);

    res.json({ mensaje: "Turno reservado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Obtener historial de turnos
app.get("/historial", async (req, res) => {
  try {
    const historialDeTurnos = await Turno.find();
    if (historialDeTurnos.length === 0) {
      return res.json({ mensaje: "Historial de turnos vacío" });
    }
    res.json(historialDeTurnos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Obtener un turno específico por especialidad y ID
app.get("/historial/:especialidad/:id", async (req, res) => {
  try {
    const turnoId = req.params.id;
    const especialidad = req.params.especialidad;
    const turno = await Turno.findOne({ _id: turnoId, especialidad: especialidad });
    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }
    res.json(turno);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Obtener lista de profesionales de una especialidad
app.get("/especialidades/:especialidad/profesionales", (req, res) => {
  const especialidad = req.params.especialidad;
  const especialidadEncontrada = especialidades.find(
    (e) => e.especialidad === especialidad
  );

  if (!especialidadEncontrada) {
    return res.status(404).json({ mensaje: "Especialidad no encontrada" });
  }

  const profesionales = especialidadEncontrada.profesionales;
  res.json({profesionales });
});

// Obtener fechas de los turnos elegidos de una especialidad
app.get("/historial/:especialidad/fechas", async (req, res) => {
  try {
    const especialidad = req.params.especialidad;
    const fechasEspecialidad = await Turno.find({ especialidad });
    const fechasTurnos = fechasEspecialidad.map(turno => turno.fecha);

    res.json(fechasTurnos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Historial de cada especialidad
app.get("/historial/:especialidad", async (req, res) => {
  try {
    const especialidad = req.params.especialidad;
    const historialEspecialidad = await Turno.find({ especialidad });
    if (historialEspecialidad.length === 0) {
      return res.json({ mensaje: "No hay turnos para esa especialidad" });
    }
    res.json(historialEspecialidad);
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Eliminar turno
app.delete("/historial/:id", async (req, res) => {
  try {
    const turnoId = req.params.id;
    const turnoEliminado = await Turno.findByIdAndDelete(turnoId);
    if (!turnoEliminado) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    const especialidad = turnoEliminado.especialidad;
    const especialidadEncontrada = especialidades.find(
      (e) => e.especialidad === especialidad
    );
    if (especialidadEncontrada) {
      especialidadEncontrada.turnos.push(turnoEliminado.fecha);
    }

    res.json({ mensaje: "Turno eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Modificar un turno específico por ID
app.put("/historial/:especialidad/:id", async (req, res) => {
  try {
    const turnoId = req.params.id;
    const especialidad = req.params.especialidad;
    const { fecha, profesional } = req.body;

    const turno = await Turno.findOneAndUpdate(
      { _id: turnoId, especialidad: especialidad },
      { fecha, profesional },
      { new: true } 
    );

    if (!turno) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    res.json(turno); 
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

//Conectarse a mongoDB
mongoose
  .connect(
    "mongodb+srv://matiascoriaof:kFeCs9dzMKcWWyJi@cluster1.69dx0ku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
  )
  .then(() => {
    console.log("Conectado a la base de datos!");
  })
  .catch(() => {
    console.log("Conexión fallida!");
  });

app.listen(port, () => {
  console.log("El servidor está ejecutandose en el puerto 3000...");
});
