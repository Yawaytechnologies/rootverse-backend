// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

export function buildSwaggerSpec() {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "RootVerse / OneBlue Backend API",
        version: "2.0.0",
        description:
          "Complete API documentation for the RootVerse fishery management platform, including the " +
          "OneBlue cold-chain supply chain workflow. Covers authentication, owner management, vessel " +
          "registration, trip planning, QR code lifecycle, quality checking, crate management, " +
          "collection centre operations, transport operator workflow, and admin monitoring.",
        contact: {
          name: "RootVerse Team",
        },
      },
      servers: [
        { url: "http://localhost:5000", description: "Local Development" },
        // { url: "https://rootverse-backend.onrender.com", description: "Production" },
      ],
      tags: [
        { name: "Auth", description: "Phone-based login and shared auth endpoints" },
        { name: "Admins", description: "Admin management, collection centre setup, and monitoring" },
        { name: "Super Admins", description: "Super admin management" },
        { name: "Collection Centre", description: "Collection centre operator workflow" },
        { name: "Transport", description: "Transport operator workflow" },
        { name: "Owners", description: "Owner registration and management" },
        { name: "Users", description: "User profile" },
        { name: "Vessels", description: "Vessel registration" },
        { name: "Trip Plans", description: "Trip planning" },
        { name: "QR Codes", description: "Fish QR code lifecycle" },
        { name: "Crate QRs", description: "Crate QR generation and management" },
        { name: "Crate Packers", description: "Crate packer management" },
        { name: "Quality Checker", description: "Quality checker management" },
        { name: "Farms", description: "Farm registration and management" },
        { name: "Ponds", description: "Pond management" },
        { name: "Fish Types", description: "Fish type reference data" },
        { name: "Fishing Methods", description: "Fishing method reference data" },
        { name: "States", description: "State reference data" },
        { name: "Districts", description: "District reference data" },
        { name: "Locations", description: "Location reference data" },
        { name: "Countries", description: "Country reference data" },
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
