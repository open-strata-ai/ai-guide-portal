import { describe, it, expect } from "vitest";
import { guideApi } from "../infrastructure/guideApiClient";

// Build-time smoke test (Batch J3). The production build (`tsc && vite build`)
// already type-checks every guide-portal page (capability catalog, dependency
// preview, canary, rollback); this confirms the shared API client loads.
describe("guide-portal guideApi", () => {
  it("exports a configured GuidePort client", () => {
    expect(guideApi).toBeDefined();
    expect(typeof guideApi.getCapabilities).toBe("function");
  });
});
