describe("Product search", () => {
  it("shows product results while typing in search", () => {
    cy.viewport(1440, 900);

    cy.visit("/");

    cy.get('button[aria-label="Leita"]').click();

    cy.get("input:visible").should("exist").type("ZING");

    cy.contains("ZING sokkaprjónar").should("be.visible");
  });
});
