import { describe, it, expect } from "vitest";
import { removeEmptyKeys } from "./removeEmptyKeys";

describe("removeEmptyKeys", () => {
  it("should keep truthy values", () => {
    const input = {
      name: "John",
      age: 25,
      active: true,
      items: [1, 2],
      nested: { key: "value" },
    };

    const result = removeEmptyKeys(input);

    expect(result).toEqual(input); // unchanged
  });

  it("should keep falsy values false and 0", () => {
    const input = {
      isActive: false,
      quantity: 0,
      price: 100,
    };

    const result = removeEmptyKeys(input);

    expect(result).toEqual({
      isActive: false,
      quantity: 0,
      price: 100,
    });
  });

  it("should remove empty string, null, undefined, and NaN", () => {
    const input = {
      username: "",
      email: null,
      token: undefined,
      count: Number.NaN,
      valid: true,
    };

    const result = removeEmptyKeys(input);

    expect(result).toEqual({
      valid: true,
    });
  });

  it("should remove only keys with values considered empty", () => {
    const input = {
      a: "",
      b: 0,
      c: false,
      d: null,
      e: "hello",
      f: undefined,
    };

    const result = removeEmptyKeys(input);

    expect(result).toEqual({
      b: 0,
      c: false,
      e: "hello",
    });
  });

  it("should handle an empty object", () => {
    expect(removeEmptyKeys({})).toEqual({});
  });

  it("should handle objects where all values are removed", () => {
    const input = {
      a: "",
      b: null,
      c: undefined,
      d: Number.NaN,
    };

    const result = removeEmptyKeys(input);

    expect(result).toEqual({});
  });

  it("should not mutate the original object", () => {
    const input = { a: "", b: 1 };
    const copy = { ...input };

    removeEmptyKeys(input);

    expect(input).toEqual(copy);
  });
});

