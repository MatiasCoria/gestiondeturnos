describe("Mi primer test", () => {
  it("Gets, types and asserts", () => {
    cy.visit("https://example.cypress.io");
    cy.contains("type").click();
    cy.url().should("include", "/commands/actions");
    cy.get(".action-email").type("fake@email.com");
    cy.get(".action-email").should("have.value", "fake@email.com");
  });
  it("otro test", () => {
    cy.visit("https://www.uno.edu.ar/");
    cy.get("#mod-search-searchword").type("mesa");
    cy.get("input[type='submit']");
  });
});
