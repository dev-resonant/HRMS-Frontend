import { describe, it, expect, vi } from "vitest";
import { getFormData } from "./formData";

describe("getFormData (browser-like) - converts inputs object -> FormData", () => {
  it("appends primitive values (string, number, boolean) to FormData", () => {
    const inputs = {
      name: "Alice",
      age: 30,
      subscribed: true,
      count: 0,
      active: false,
    };

    const fd = getFormData(inputs);

    expect(fd.get("name")).toBe("Alice");
    expect(fd.get("age")).toBe("30");
    expect(fd.get("subscribed")).toBe("true");
    expect(fd.get("count")).toBe("0");
    expect(fd.get("active")).toBe("false");
  });

  it("skips undefined and null values", () => {
    const inputs = {
      present: "ok",
      missing: undefined,
      nothing: null,
    };

    const fd = getFormData(inputs);

    expect(fd.get("present")).toBe("ok");
    expect(fd.get("missing")).toBeNull();
    expect(fd.get("nothing")).toBeNull();
  });

  it("serializes plain objects as JSON strings", () => {
    const inputs = {
      user: { id: 1, name: "bob" },
    };

    const fd = getFormData(inputs);
    expect(fd.get("user")).toBe(JSON.stringify({ id: 1, name: "bob" }));
  });

  it("converts Date to ISO string", () => {
    const d = new Date("2020-01-02T03:04:05.000Z");
    const inputs = { when: d };

    const fd = getFormData(inputs);
    expect(fd.get("when")).toBe(d.toISOString());
  });

  it("stringifies arrays of primitives as JSON", () => {
    const inputs = { tags: ["x", "y", "z"] };
    const fd = getFormData(inputs);
    expect(fd.get("tags")).toBe(JSON.stringify(["x", "y", "z"]));
  });

  it("does not append empty arrays", () => {
    const inputs = { arr: [] };
    const fd = getFormData(inputs);
    expect(fd.get("arr")).toBeNull();
  });

  it("appends array of File objects individually", () => {
    const fileA = new File(["file-a-contents"], "a.txt", { type: "text/plain" });
    const fileB = new File(["file-b-contents"], "b.txt", { type: "text/plain" });

    const inputs = { uploads: [fileA, fileB] };
    const fd = getFormData(inputs);

    const all = fd.getAll("uploads");
    expect(all.length).toBe(2);
    expect(all[0].name).toBe("a.txt");
    expect(all[1].name).toBe("b.txt");
  });

  it("appends array of Blob objects individually", () => {
    const blob1 = new Blob(["blob1"], { type: "text/plain" });
    const blob2 = new Blob(["blob2"], { type: "text/plain" });

    const inputs = { data: [blob1, blob2] };
    const fd = getFormData(inputs);

    const all = fd.getAll("data");
    expect(all.length).toBe(2);
    expect(all[0]).toBeInstanceOf(Blob);
    expect(all[1]).toBeInstanceOf(Blob);
  });

  it("handles a single File object in an array", () => {
    const single = new File(["single"], "single.txt", { type: "text/plain" });
    const inputs = { upload: [single] };
    const fd = getFormData(inputs);

    const all = fd.getAll("upload");
    expect(all.length).toBe(1);
    expect(all[0].name).toBe("single.txt");
  });

  it("appends single File or Blob directly", () => {
    const file = new File(["content"], "test.txt");
    const blob = new Blob(["content"]);
    const inputs = { file, blob };

    const fd = getFormData(inputs);

    // In some environments, FormData.get might return a File even if a Blob was appended
    // So we check instance and content properties instead of strict equality
    expect(fd.get("file")).toBeInstanceOf(File);
    expect(fd.get("blob")).toBeInstanceOf(Blob);
    expect(fd.get("file").size).toBe(file.size);
    expect(fd.get("blob").size).toBe(blob.size);
  });

  it("calls provided callback with the FormData instance", () => {
    const spy = vi.fn();
    const inputs = { a: "x" };
    const fd = getFormData(inputs, spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(fd);
  });

  it("serializes nested non-Date objects as JSON", () => {
    const inputs = { nested: { a: 1, b: { c: 3 } } };
    const fd = getFormData(inputs);
    expect(fd.get("nested")).toBe(JSON.stringify({ a: 1, b: { c: 3 } }));
  });

  it("handles invalid inputs gracefully", () => {
    expect(getFormData(null)).toBeInstanceOf(FormData);
    expect(getFormData(undefined)).toBeInstanceOf(FormData);
    expect(getFormData("string")).toBeInstanceOf(FormData);
    expect(getFormData(123)).toBeInstanceOf(FormData);
  });

  it("handles mixed arrays (Files/Blobs skipped if not instance of either)", () => {
    const file = new File(["file"], "f.txt");
    const inputs = { mixed: [file, "not-a-file", 123] };
    const fd = getFormData(inputs);

    const all = fd.getAll("mixed");
    expect(all.length).toBe(1);
    expect(all[0]).toEqual(file);
  });
});

