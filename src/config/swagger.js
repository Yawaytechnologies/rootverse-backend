// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

export function buildSwaggerSpec() {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "RootVerse Backend API",
        version: "1.0.0",
        description:
          "Complete API documentation for the RootVerse fishery management platform. " +
          "Covers authentication, owner management, vessel registration, trip planning, " +
          "QR code lifecycle, quality checking, crate management, and admin operations.",
        contact: {
          name: "RootVerse Team",
        },
      },
      servers: [
        { url: "http://localhost:5000", description: "Local Development" },
        // { url: "https://rootverse-backend.onrender.com", description: "Production" },
      ],
    },

    // ✅ Primary docs file + all module files for any future inline JSDoc
    apis: [
      "./src/config/swagger.docs.js",
      "./src/modules/**/*.js",
      "./src/app.js",
    ],
  };

  const spec = swaggerJSDoc(options);
  console.log(
    `✅ Swagger loaded — ${Object.keys(spec.paths || {}).length} paths documented`
  );
  return spec;
}
