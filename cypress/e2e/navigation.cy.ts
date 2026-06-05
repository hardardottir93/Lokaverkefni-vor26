describe("Navigation", () => {
  it("shows the homepage and navigates to products", () => {
    cy.viewport(1440, 900);

    cy.visit("/");

    cy.contains("Prjónabúðin").should("be.visible");

    cy.get('a[href="/products"]:visible').first().click();

    cy.url().should("include", "/products");
    cy.contains("Vörur").should("be.visible");
  });
});
