import { jestTest } from "./database/services/userServices";
import dotenv from "dotenv";
dotenv.config();

describe("jestTest", () => {
  it("should return the correct number from environment variable", () => {
    const result = jestTest();
    expect(result).toBe(17);
  });
});
