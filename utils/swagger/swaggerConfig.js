const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Success Web API",
    version: "1.0.0",
    description: `

      # Welcome to Success Web API Documentation

      FastCrawler is a backend service designed to crawl, index, and manage websites efficiently. 
      This API allows users to submit websites, track crawling statuses, and retrieve indexed data.

      ## Key Features
      - **User Management**: Manage users and their authentication.
      - **Website Submission**: Add, update, and delete website entries.
      - **Crawling Status**: Monitor website crawling progress and results.
      - **Indexed Data Retrieval**: Fetch stored website metadata and HTML content.
      - **Logs & Error Tracking**: Keep track of crawling events and issues.

      ## Authentication
      - Some endpoints require authentication via JWT tokens.
      - Use **Bearer Token** authentication in the "Authorization" header.

      ## Support
      For assistance, contact [Success Web Support](mailto:support@successweb.pro).

    `,
  contact: {
    name: "Success Web Team",
    email: "support@successweb.pro",
  },
},
  servers: [
    {
      url: "https://api.successweb.pro",
      description: "Production Server",
    },
    {
      url: "http://localhost:5005",
      description: "Local Development Server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    "./routes/users/docs.js",
    "./routes/subscriptions/docs.js",
  
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
