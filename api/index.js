const dotenv = require('dotenv');
const express = require("express");
const cors = require("cors");
const http = require("http");

const { swaggerUi, swaggerSpec } = require("../utils/swagger/swaggerConfig.js");

const { users, subscriptions, accounts, withdrawals, transactions, password_logs, sequelize } = require("../models/index.js");


const app = express();


// ---------------------------------------------------- Middleware Configuration -------------------------------------------------------------

dotenv.config();
// DBConnection();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.use(bodyParser.json());

// ---------------------------------------------------- Testing Routes -----------------------------------------------------------------------

app.get("/", function rootHandler(req, res) {
  res.end("Hello Success Backend API!");
});
app.get("/successweb", (req, res) => { res.send("Hello from Success Web Backend"); });


// ---------------------------------------------------- Super Backend Routes -----------------------------------------------------------------------

app.use("/users", require("../routes/users/index.js"));
app.use("/subscriptions", require("../routes/subscriptions/index.js"));
app.use("/accounts", require("../routes/accounts/index.js"));
app.use("/withdrawals", require("../routes/withdrawals/index.js"));
app.use("/inquiryemail", require("../routes/inquiryemail/index.js"));

// ---------------------------------------------------- Swagger Main Integration -------------------------------------------------------------

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Success Web Backend API Documentation",
  })
);

// ---------------------------------------------------- Server  Port -------------------------------------------------------------------------

const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log(`Server is running perfectly on http://localhost:${port}`);
});


// ---------------------------------------------------- ALTER TABLES -------------------------------------------------------------------------
async function alterTable() {
  try {
    await password_logs.sync({ force: true });
    console.log("The table for the new model was just (re)created!");
  } catch (error) {
    console.error("Error syncing the table:", error.message);
  }
}

// ---------------------------------------------------- UTILITY Functions --------------------------------------------------------------------

// alterTable();