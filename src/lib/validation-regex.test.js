import { describe, expect, it } from "vitest";
import { AMOUNT_REGEX, DATE_REGEX, TIME_REGEX } from "./validation-regex";

describe("AMOUNT_REGEX", () => {
  it("should match valid amount strings", () => {
    expect(AMOUNT_REGEX.test("100")).toBe(true);
    expect(AMOUNT_REGEX.test("123.45")).toBe(true);
    expect(AMOUNT_REGEX.test("0.99")).toBe(true);
    expect(AMOUNT_REGEX.test("0.01")).toBe(true);
  });

  it("should not match invalid amount strings", () => {
    expect(AMOUNT_REGEX.test("100.")).toBe(false); // Decimal point but no decimal digits
    expect(AMOUNT_REGEX.test("123.456")).toBe(false); // More than two decimal digits
    expect(AMOUNT_REGEX.test(".99")).toBe(false); // No digits before decimal point
    expect(AMOUNT_REGEX.test("random string")).toBe(false);
  });
});

describe("DATE_REGEX", () => {
  it("should match valid date strings", () => {
    expect(DATE_REGEX.test("2022-01-01")).toBe(true);
    expect(DATE_REGEX.test("1999-12-31")).toBe(true);
    expect(DATE_REGEX.test("2000-02-29")).toBe(true); // Leap year
  });

  it("should not match invalid date strings", () => {
    expect(DATE_REGEX.test("2022-13-01")).toBe(false); // Invalid month
    expect(DATE_REGEX.test("2022-02-32")).toBe(false); // Invalid day
    // expect(DATE_REGEX.test('2022-02-30')).toBe(false); // Invalid day
    // expect(DATE_REGEX.test('2001-02-29')).toBe(false); // Non-leap year
    expect(DATE_REGEX.test("22-01-01")).toBe(false); // Two digit year
    expect(DATE_REGEX.test("random string")).toBe(false);
  });
});

describe("TIME_REGEX", () => {
  it("should match valid time strings", () => {
    expect(TIME_REGEX.test("00:00:00")).toBe(true);
    expect(TIME_REGEX.test("12:34:56")).toBe(true);
    expect(TIME_REGEX.test("23:59:59")).toBe(true);
  });

  it("should not match invalid time strings", () => {
    expect(TIME_REGEX.test("24:00:00")).toBe(false);
    expect(TIME_REGEX.test("00:60:00")).toBe(false);
    expect(TIME_REGEX.test("00:00:60")).toBe(false);
    expect(TIME_REGEX.test("1:00:00")).toBe(false);
    expect(TIME_REGEX.test("00:1:00")).toBe(false);
    expect(TIME_REGEX.test("00:00:1")).toBe(false);
    expect(TIME_REGEX.test("random string")).toBe(false);
  });
});

