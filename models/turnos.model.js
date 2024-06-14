const mongoose = require("mongoose");

const turnoSchema = new mongoose.Schema({
  especialidad: {
    type: String,
    required: true
  },
  fecha: {
    type: String,
    required: true
  },
  profesional: {
    type: String,
    required: true
  }
});

const Turno = mongoose.model("Turno", turnoSchema);

module.exports = Turno;