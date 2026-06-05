describe("Cart", () => {
  it("adds a product to the cart", () => {
    cy.viewport(1440, 900);

    cy.visit("/products");

    cy.contains("ZING sokkaprjónar").click();

    cy.contains("Bæta í körfu").click();

    cy.get('[aria-label="Karfa"]').click();

    cy.url().should("include", "/cart");
    cy.contains("ZING sokkaprjónar").should("be.visible");
  });
});
