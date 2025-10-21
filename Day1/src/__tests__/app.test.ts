import request from "supertest";
import app from "../app"; // your app.ts file

describe("Node.js Express Routes", () => {
  it("GET / should return Hello message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello, Node.js with TypeScript!");
  });

  it("GET /example should return JSON message", async () => {
    const res = await request(app).get("/example");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
