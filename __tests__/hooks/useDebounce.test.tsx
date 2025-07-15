import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../app/hooks/useDebounce";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    // Change the value
    rerender({ value: "changed", delay: 500 });

    // Value should still be the initial value
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe("changed");
  });

  it("should cancel previous timeout when value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    // Change value multiple times quickly
    rerender({ value: "first", delay: 500 });
    rerender({ value: "second", delay: 500 });
    rerender({ value: "final", delay: 500 });

    // Value should still be initial
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should only show the final value
    expect(result.current).toBe("final");
  });

  it("should work with different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 1000 } }
    );

    rerender({ value: "changed", delay: 1000 });

    // Should not change before delay
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    // Should change after delay
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("changed");
  });

  it("should work with numbers", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    rerender({ value: 42, delay: 300 });

    expect(result.current).toBe(0);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it("should work with objects", () => {
    const initialObj = { name: "John" };
    const changedObj = { name: "Jane" };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 200 } }
    );

    rerender({ value: changedObj, delay: 200 });

    expect(result.current).toBe(initialObj);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe(changedObj);
  });
});
