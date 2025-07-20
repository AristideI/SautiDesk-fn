import getAuthToken from "../../utils/getAuthToken";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

describe("getAuthToken", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear();
  });

  it("should return null when no token is stored", () => {
    const token = getAuthToken();
    expect(token).toBeNull();
  });

  it("should return stored token when available", () => {
    const testToken = "test-auth-token";
    localStorage.setItem("token", testToken);

    const token = getAuthToken();
    expect(token).toBe(testToken);
  });
});
