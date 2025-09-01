// Simple utility function test to ensure Jest is working
describe("Example Utils", () => {
  it("should perform basic arithmetic", () => {
    const add = (a: number, b: number) => a + b;
    expect(add(2, 3)).toBe(5);
  });

  it("should handle string operations", () => {
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);
    expect(capitalize("hello")).toBe("Hello");
  });

  it("should work with arrays", () => {
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map((n) => n * 2);
    expect(doubled).toEqual([2, 4, 6, 8, 10]);
  });
});
