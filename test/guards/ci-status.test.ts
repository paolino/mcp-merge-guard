import { describe, it, expect } from "vitest";
import { checkCiStatus } from "../../src/guards/ci-status.js";
import type { CheckRun, StatusCheck } from "../../src/gh/types.js";

describe("checkCiStatus", () => {
  it("passes when all checks succeed", () => {
    const checks: CheckRun[] = [
      { name: "Build", status: "COMPLETED", conclusion: "SUCCESS" },
      { name: "Test", status: "COMPLETED", conclusion: "SUCCESS" },
    ];
    const statuses: StatusCheck[] = [];

    const result = checkCiStatus(checks, statuses);

    expect(result.passed).toBe(true);
    expect(result.message).toContain("2 check(s) passed");
  });

  it("passes when checks are skipped", () => {
    const checks: CheckRun[] = [
      { name: "Build", status: "COMPLETED", conclusion: "SUCCESS" },
      { name: "Optional", status: "COMPLETED", conclusion: "SKIPPED" },
    ];
    const statuses: StatusCheck[] = [];

    const result = checkCiStatus(checks, statuses);

    expect(result.passed).toBe(true);
  });

  it("passes when checks are neutral", () => {
    const checks: CheckRun[] = [
      { name: "Build", status: "COMPLETED", conclusion: "NEUTRAL" },
    ];
    const statuses: StatusCheck[] = [];

    const result = checkCiStatus(checks, statuses);

    expect(result.passed).toBe(true);
  });

  it("fails when a check fails", () => {
    const checks: CheckRun[] = [
      { name: "Build", status: "COMPLETED", conclusion: "SUCCESS" },
      { name: "Test", status: "COMPLETED", conclusion: "FAILURE" },
    ];
    const statuses: StatusCheck[] = [];

    const result = checkCiStatus(checks, statuses);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("1 check(s) failed");
    expect(result.message).toContain("Test");
  });

  it("fails when checks are pending", () => {
    const checks: CheckRun[] = [
      { name: "Build", status: "IN_PROGRESS", conclusion: null },
      { name: "Test", status: "QUEUED", conclusion: null },
    ];
    const statuses: StatusCheck[] = [];

    const result = checkCiStatus(checks, statuses);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("2 check(s) pending");
  });

  it("reports failed checks before pending", () => {
    const checks: CheckRun[] = [
      { name: "Build", status: "COMPLETED", conclusion: "FAILURE" },
      { name: "Test", status: "IN_PROGRESS", conclusion: null },
    ];
    const statuses: StatusCheck[] = [];

    const result = checkCiStatus(checks, statuses);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("failed");
  });

  it("handles status checks", () => {
    const checks: CheckRun[] = [];
    const statuses: StatusCheck[] = [
      { context: "external/ci", state: "SUCCESS" },
    ];

    const result = checkCiStatus(checks, statuses);

    expect(result.passed).toBe(true);
  });

  it("fails when status check fails", () => {
    const checks: CheckRun[] = [];
    const statuses: StatusCheck[] = [
      { context: "external/ci", state: "FAILURE" },
    ];

    const result = checkCiStatus(checks, statuses);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("external/ci");
  });

  it("passes with no checks configured", () => {
    const result = checkCiStatus([], []);

    expect(result.passed).toBe(true);
    expect(result.message).toBe("No CI checks configured");
  });
});
