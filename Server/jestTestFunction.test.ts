import jestTest from "./database/db";
import dotenv from "dotenv";
dotenv.config();

describe("jestTest", () => {
  it("should return the correct number from environment variable", () => {
    const res = jestTest;
    expect(res).toBe("pealh0320 245810");
  });
});
