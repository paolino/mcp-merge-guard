import { describe, it, expect } from "vitest";
import { runGuards } from "../../src/guards/index.js";
import prReady from "../fixtures/pr-ready.json";
import prFailingCi from "../fixtures/pr-failing-ci.json";
import prBehind from "../fixtures/pr-behind.json";

describe("runGuards", () => {
  it("reports all passed when PR is ready", () => {
    const report = runGuards({
      prInfo: prReady.prInfo as any,
      checks: prReady.checks as any,
      statuses: prReady.statuses as any,
    });

    expect(report.allPassed).toBe(true);
    expect(report.guards).toHaveLength(3);
    expect(report.guards.every((g) => g.passed)).toBe(true);
  });

  it("reports failure when CI fails", () => {
    const report = runGuards({
      prInfo: prFailingCi.prInfo as any,
      checks: prFailingCi.checks as any,
      statuses: prFailingCi.statuses as any,
    });

    expect(report.allPassed).toBe(false);
    const ciGuard = report.guards.find((g) => g.name === "ci-status");
    expect(ciGuard?.passed).toBe(false);
  });

  it("does not include up-to-date guard by default", () => {
    const report = runGuards({
      prInfo: prBehind.prInfo as any,
      checks: prBehind.checks as any,
      statuses: prBehind.statuses as any,
    });

    expect(report.guards).toHaveLength(3);
    expect(report.guards.find((g) => g.name === "up-to-date")).toBeUndefined();
    expect(report.allPassed).toBe(true);
  });

  it("includes up-to-date guard when required", () => {
    const report = runGuards({
      prInfo: prBehind.prInfo as any,
      checks: prBehind.checks as any,
      statuses: prBehind.statuses as any,
      options: { requireUpToDate: true },
    });

    expect(report.guards).toHaveLength(4);
    const upToDateGuard = report.guards.find((g) => g.name === "up-to-date");
    expect(upToDateGuard?.passed).toBe(false);
    expect(report.allPassed).toBe(false);
  });

  it("includes timestamp in report", () => {
    const report = runGuards({
      prInfo: prReady.prInfo as any,
      checks: prReady.checks as any,
      statuses: prReady.statuses as any,
    });

    expect(report.timestamp).toBeDefined();
    expect(new Date(report.timestamp).getTime()).not.toBeNaN();
  });
});
