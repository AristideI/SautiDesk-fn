import { apiUrl, openAIApiKey, astraToken, astraDbUrl } from "../../utils/env";

describe("Environment Variables", () => {
  it("should export apiUrl", () => {
    expect(apiUrl).toBeDefined();
    expect(typeof apiUrl).toBe("string");
  });

  it("should export openAIApiKey", () => {
    expect(openAIApiKey).toBeDefined();
    expect(typeof openAIApiKey).toBe("string");
  });

  it("should export astraToken", () => {
    expect(astraToken).toBeDefined();
    expect(typeof astraToken).toBe("string");
  });

  it("should export astraDbUrl", () => {
    expect(astraDbUrl).toBeDefined();
    expect(typeof astraDbUrl).toBe("string");
  });

  it("should have expected values from environment", () => {
    expect(apiUrl).toBe("http://localhost:3000");
    expect(openAIApiKey).toBe("test-openai-key");
    expect(astraToken).toBe("test-astra-token");
    expect(astraDbUrl).toBe("http://localhost:8080");
  });
});
