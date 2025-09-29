const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Barbería",
      version: "1.0.0",
      description: "Documentación de mi API con Swagger y autenticación JWT",
    },
    servers: [
      {
        url: "https://ttte-devs.onrender.com", // 👉 cambia por la URL de tu Render
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Esto aplica JWT globalmente
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Rutas donde pondrás la doc
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
