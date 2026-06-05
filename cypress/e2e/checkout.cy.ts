/// <reference types="cypress" />

describe("Checkout", () => {
  it("completes fake payment as a logged in user", () => {
    cy.viewport(1440, 900);

    cy.visit("/login");

    cy.get('input[type="email"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(Cypress.env("TEST_EMAIL"));

    cy.get('input[type="password"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(Cypress.env("TEST_PASSWORD"));

    cy.get('button[type="submit"]', { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 15000 }).should("not.include", "/login");

    cy.get('a[aria-label="Mín síða"]', { timeout: 15000 }).should("be.visible");

    cy.visit("/products");

    cy.contains("ZING sokkaprjónar", { timeout: 15000 })
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 10000 }).should("include", "/products/");

    cy.contains("button", "Bæta í körfu", { timeout: 15000 })
      .should("be.visible")
      .click({ force: true });

    cy.get('a[aria-label="Karfa"] span', { timeout: 15000 })
      .should("be.visible")
      .and("not.have.text", "0");

    cy.get('a[aria-label="Karfa"]', { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 10000 }).should("include", "/cart");

    cy.contains("ZING sokkaprjónar", { timeout: 15000 }).should("be.visible");

    cy.contains(
      "button, a",
      /ganga frá pöntun|klára pöntun|halda áfram|áfram í greiðslu|greiða/i,
      { timeout: 15000 },
    )
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 15000 }).should("include", "/checkout");

    cy.contains("Greiðsla", { timeout: 15000 }).should("be.visible");
    cy.contains("Karfan er tóm", { timeout: 1000 }).should("not.exist");

    cy.get('input[name="fullName"]', { timeout: 15000 })
      .should("be.visible")
      .clear()
      .type("Test User");

    cy.get('input[name="address"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type("Prufugata 1");

    cy.get('input[name="postalCode"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type("101");

    cy.get('input[name="city"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type("Reykjavík");

    cy.get("input:visible", { timeout: 10000 }).then(($inputs) => {
      cy.wrap($inputs.eq(4)).clear().type("Test notandi");
      cy.wrap($inputs.eq(5)).clear().type("4242424242424242");
      cy.wrap($inputs.eq(6)).clear().type("1230");
      cy.wrap($inputs.eq(7)).clear().type("123");
    });

    cy.contains("button", "Staðfesta gervigreiðslu", {
      timeout: 15000,
    })
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 15000 }).should("include", "/order-confirmation");

    cy.contains(/staðfest|pöntun|takk/i, { timeout: 15000 }).should(
      "be.visible",
    );
  });
});
