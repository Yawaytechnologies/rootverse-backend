// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

export function buildSwaggerSpec() {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "RootVerse Backend API",
        version: "1.0.0",
        description: "RootVerse API documentation",
      },
      servers: [
        { url: "http://localhost:5000", description: "Local" },
        // { url: "https://rootverse-backend.onrender.com", description: "Prod" },
      ],
    },

    // ✅ IMPORTANT: this must match where your jsdoc comments are
    apis: [
      "./src/modules/**/*.js",
      "./src/app.js",
      "./src/server.js",
    ],
  };

  const spec = swaggerJSDoc(options);
  console.log("Swagger paths count:", Object.keys(spec.paths || {}).length);
  return spec;
}
