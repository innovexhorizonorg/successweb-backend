const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bid", "bryxo_id", "bryxo@usersdb", {
  host: "185.182.187.222",
  dialect: "postgres",
  port:5433
});

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sq: sequelize, testDbConnection };
