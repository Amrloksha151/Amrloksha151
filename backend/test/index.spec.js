import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index.js";

// ============================================================
// POST /contact - Tests
// ============================================================
describe("POST /contact", () => {
  it("returns 400 with validation errors for empty body", async () => {
    const request = new Request("http://example.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
    expect(Array.isArray(body.details)).toBe(true);
    expect(body.details.length).toBeGreaterThan(0);
  });

  it("returns 400 for invalid email format", async () => {
    const request = new Request("http://example.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John Doe",
        email: "not-an-email",
        subject: "Test subject here",
        message: "This is a long enough message for testing purposes.",
      }),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details.some((d) => d.includes("email"))).toBe(true);
  });

  it("returns 400 for name too short (< 2 chars)", async () => {
    const request = new Request("http://example.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "A",
        email: "valid@email.com",
        subject: "Valid subject text",
        message: "This message is definitely long enough to pass validation.",
      }),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.details.some((d) => d.includes("name"))).toBe(true);
  });

  it("returns 400 for subject too short (< 5 chars)", async () => {
    const request = new Request("http://example.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John Doe",
        email: "valid@email.com",
        subject: "Hi",
        message: "This message is definitely long enough to pass validation.",
      }),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.details.some((d) => d.includes("subject"))).toBe(true);
  });

  it("returns 400 for message too short (< 20 chars)", async () => {
    const request = new Request("http://example.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John Doe",
        email: "valid@email.com",
        subject: "Valid subject text",
        message: "Too short",
      }),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.details.some((d) => d.includes("message"))).toBe(true);
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://example.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ this is not valid json }",
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
  });
});

// ============================================================
// POST /services/inquiry - Tests
// ============================================================
describe("POST /services/inquiry", () => {
  it("returns 400 with validation errors for empty body", async () => {
    const request = new Request("http://example.com/services/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
    expect(Array.isArray(body.details)).toBe(true);
  });

  it("returns 400 for invalid service value", async () => {
    const request = new Request("http://example.com/services/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        email: "jane@example.com",
        service: "invalid-service",
        subject: "I need help with something",
        details: "This is a detailed description of what I need help with and it is long enough.",
      }),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.details.some((d) => d.includes("service"))).toBe(true);
  });

  it("returns 400 for details too short (< 20 chars)", async () => {
    const request = new Request("http://example.com/services/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        email: "jane@example.com",
        service: "pentest",
        subject: "Pentest my app",
        details: "Too short",
      }),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.details.some((d) => d.includes("details"))).toBe(true);
  });

  it("accepts valid service enum values", async () => {
    // Test that all valid services pass service validation (DB might fail, that's ok)
    const validServices = ["pentest", "code-review", "web-dev", "consultation"];
    for (const service of validServices) {
      const request = new Request("http://example.com/services/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane@example.com",
          service,
          subject: "Test inquiry subject",
          details: "This is a detailed description that is definitely long enough to pass validation.",
        }),
      });
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
      // Should not get a service validation error (may get 500 if DB not configured in test env)
      const body = await response.json();
      if (response.status === 400) {
        expect(body.details?.some((d) => d.includes("service"))).toBe(false);
      }
    }
  });
});

// ============================================================
// CORS and Routing Tests
// ============================================================
describe("CORS and routing", () => {
  it("returns 404 JSON for unknown routes", async () => {
    const request = new Request("http://example.com/unknown-route");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Not found");
  });

  it("returns 404 JSON for GET /", async () => {
    const request = new Request("http://example.com/");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  });

  it("handles OPTIONS preflight with 204", async () => {
    const request = new Request("http://example.com/contact", {
      method: "OPTIONS",
      headers: {
        Origin: "https://amrloksha151.me",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("sets CORS headers on all responses", async () => {
    const request = new Request("http://example.com/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://amrloksha151.me",
      },
      body: JSON.stringify({}),
    });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
  });
});
