module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {  // Table name unchanged
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM("admin", "user"), defaultValue: "user" },
     });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  }
};
