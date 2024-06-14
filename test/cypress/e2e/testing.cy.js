describe("Testeando gestion de turnos en Render", () => {
  it("Sacar un turno", () => {
    cy.visit("https://gestiondeturnos.onrender.com/");
    cy.wait(1000);
    cy.get("#especialidades").select("Traumatologia");
    cy.get("#datepicker").click();
    cy.get('span.flatpickr-day[tabindex="-1"]').first().click();
    cy.get("#profesionales").select("Esteban Santillan");
    cy.get("#btn-submit").click(); 
    cy.wait(1000);
  });
  it("Modificar un turno", () => {
    cy.visit("https://gestiondeturnos.onrender.com/");
    cy.contains("a", "Mis turnos").click();
    cy.get("#btn0").click();
    cy.wait(1000);
    cy.get("#datepicker").click();
    cy.get('span.flatpickr-day[tabindex="-1"]').first().click();
    cy.wait(1000);
    cy.get("#profesionales").select("Pedro Samid");
    cy.get("#btn-submit2").click();
    cy.wait(1000);
  });
  it("Eliminar un turno", () => {
    cy.visit("https://gestiondeturnos.onrender.com/");
    cy.contains("a", "Mis turnos").click();
    cy.get(".btndel0").click();
    cy.wait(1000)
  });
});
