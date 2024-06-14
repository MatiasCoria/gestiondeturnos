describe("Testeando gestion de turnos en Render", () => {
  it("Sacar un turno", () => {
    cy.visit("https://gestiondeturnos.onrender.com/");
    cy.wait(1000);
    cy.get("#especialidades").select("Odontologia");
    cy.get("#datepicker").click();
    cy.contains(".flatpickr-day", 15).click();
    cy.get("#profesionales").select("Lucas Garcia");
    cy.get("#btn-submit").click();
  });
  it("Modificar un turno", () => {
    cy.visit("https://gestiondeturnos.onrender.com/");
    cy.contains("a", "Mis turnos").click();
    cy.get("#btn0").click();
    cy.wait(500);
    cy.get("#datepicker").click();
    cy.get(".flatpickr-next-month").find("svg").click();
    cy.contains(".flatpickr-day", 1).click();
    cy.get("#profesionales").select("Marcela Balcarce");
    //Cambiar fecha
    //Agregar guardar cambios
  });
  it("Eliminar un turno", () => {
    cy.visit("https://gestiondeturnos.onrender.com/");
    cy.contains("a", "Mis turnos").click();
    cy.get(".btndel0").click();
  });
});
