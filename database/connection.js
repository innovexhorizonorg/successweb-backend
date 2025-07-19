const database  = require('./database.js');

module.exports = async function DBConnection() {
    try {
        await database.authenticate()
        console.log('Database is connected successfully.');
    } catch (error) {
      console.error("Unable to connect to the database:");
        console.error(error?.message);
    }
}
