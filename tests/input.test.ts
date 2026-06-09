import { describe, expect, it } from "vitest";
import { numberFromInput } from "@/lib/utils/input";

describe("numberFromInput", () => {
  it("allows an empty controlled input without forcing zero text", () => {
    expect(numberFromInput("")).toBe(0);
  });

  it("parses normal numeric text", () => {
    expect(numberFromInput("125.5")).toBe(125.5);
  });
});
