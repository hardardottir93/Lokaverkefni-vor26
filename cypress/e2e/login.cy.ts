describe("Login", () => {
  it("logs in with a test user", () => {
    cy.viewport(1440, 900);

    cy.visit("/login");

    cy.get('input[type="email"]').type(Cypress.env("TEST_EMAIL"));
    cy.get('input[type="password"]').type(Cypress.env("TEST_PASSWORD"));

    cy.get("form").within(() => {
      cy.contains("button", "Skrá inn").click();
    });

    cy.url().should("not.include", "/login");
    cy.get('a[aria-label="Mín síða"]').should("be.visible");
  });
});
