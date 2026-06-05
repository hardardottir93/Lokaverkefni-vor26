describe("Authenticated user", () => {
  it("logs in and opens profile page", () => {
    cy.viewport(1440, 900);

    cy.visit("/login");

    cy.get('input[type="email"]').type(Cypress.env("TEST_EMAIL"));
    cy.get('input[type="password"]').type(Cypress.env("TEST_PASSWORD"));

    cy.get("form").within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.url().should("not.include", "/login");

    cy.get('a[aria-label="Mín síða"]').click();

    cy.url().should("include", "/profile");
    cy.contains(/mín síða|prófíll|profile/i).should("be.visible");
  });
});
