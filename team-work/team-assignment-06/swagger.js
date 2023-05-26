const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Contacts API",
        description: "Practice for Input Validation and Error Handling."
    },
    host: "localhost:8080",
    schemes: ["http"]
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

// Build documentation at project startup.
swaggerAutogen(outputFile, endpointsFiles, doc);
