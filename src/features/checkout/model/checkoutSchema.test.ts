import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./checkoutSchema";

describe("checkoutSchema", () => {
  it("accepts valid checkout data", () => {
    const result = checkoutSchema.safeParse({
      fullName: "Hafrún Harðardóttir",
      address: "Laugavegur 10",
      postalCode: "101",
      city: "Reykjavík",
    });

    expect(result.success).toBe(true);
  });

  it("rejects postal code that is not 3 digits", () => {
    const result = checkoutSchema.safeParse({
      fullName: "Hafrún Harðardóttir",
      address: "Laugavegur 10",
      postalCode: "1010",
      city: "Reykjavík",
    });

    expect(result.success).toBe(false);
  });

  it("rejects city with numbers", () => {
    const result = checkoutSchema.safeParse({
      fullName: "Hafrún Harðardóttir",
      address: "Laugavegur 10",
      postalCode: "101",
      city: "Reykjavík101",
    });

    expect(result.success).toBe(false);
  });

  it("rejects too short full name", () => {
    const result = checkoutSchema.safeParse({
      fullName: "H",
      address: "Laugavegur 10",
      postalCode: "101",
      city: "Reykjavík",
    });

    expect(result.success).toBe(false);
  });
});
