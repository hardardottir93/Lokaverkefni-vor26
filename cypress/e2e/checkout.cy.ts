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

    cy.contains("Karfan er tóm", { timeout: 1000 }).should("not.exist");

    cy.contains(
      "button, a",
      /ganga frá pöntun|klára pöntun|halda áfram|áfram í greiðslu|greiða/i,
      { timeout: 15000 },
    )
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 15000 }).should("include", "/checkout");

    cy.contains("Greiðsla", { timeout: 15000 }).should("be.visible");
    cy.contains("Afhendingarupplýsingar", { timeout: 15000 }).should(
      "be.visible",
    );
    cy.contains("Karfan er tóm", { timeout: 1000 }).should("not.exist");

    cy.contains("label", "Nafn")
      .find("input")
      .should("be.visible")
      .clear()
      .type("Test User");

    cy.contains("label", "Heimilisfang")
      .find("input")
      .should("be.visible")
      .clear()
      .type("Prufugata 1");

    cy.contains("label", "Póstnúmer")
      .find("input")
      .should("be.visible")
      .clear()
      .type("101");

    cy.contains("label", "Bær")
      .find("input")
      .should("be.visible")
      .clear()
      .type("Reykjavík");

    cy.contains("label", "Nafn á korti")
      .find("input")
      .should("be.visible")
      .clear()
      .type("Test notandi");

    cy.contains("label", "Kortanúmer")
      .find("input")
      .should("be.visible")
      .clear()
      .type("4242424242424242");

    cy.contains("label", "Gildistími")
      .find("input")
      .should("be.visible")
      .clear()
      .type("1230");

    cy.contains("label", "CVC")
      .find("input")
      .should("be.visible")
      .clear()
      .type("123");

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
