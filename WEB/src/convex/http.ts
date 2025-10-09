import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api"; // Import the API for mutations

const http = httpRouter();

// Existing /hello route
http.route({
  path: "/hello",
  method: "GET",
  handler: httpAction(async ({ runQuery }) => {
    return new Response("Hello from Convex HTTP Action!", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});



// New /login route
http.route({
  path: "/login",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { email, password } = await request.json();
    try {
      const token = await ctx.runAction(api.authActions.login, { email, password });
      return new Response(JSON.stringify({ token }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401, // Unauthorized
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Convex expects the router to be the default export of http.ts
export default http;