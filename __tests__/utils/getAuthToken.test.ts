import getAuthToken from "../../utils/getAuthToken";

describe("getAuthToken", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should return token from localStorage", () => {
    const mockToken = "test-token-123";
    localStorage.getItem = jest.fn().mockReturnValue(mockToken);

    const token = getAuthToken();

    expect(localStorage.getItem).toHaveBeenCalledWith("token");
    expect(token).toBe(mockToken);
  });

  it("should return null when no token exists", () => {
    localStorage.getItem = jest.fn().mockReturnValue(null);

    const token = getAuthToken();

    expect(localStorage.getItem).toHaveBeenCalledWith("token");
    expect(token).toBeNull();
  });

  it("should return null when localStorage is not available", () => {
    // Mock localStorage.getItem to throw an error
    localStorage.getItem = jest.fn().mockImplementation(() => {
      throw new Error("localStorage not available");
    });

    const token = getAuthToken();

    expect(token).toBeNull();
  });
});
