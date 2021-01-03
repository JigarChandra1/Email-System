'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("CREATE TYPE enum_status AS ENUM ('ALLOWED', 'RISKY');");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("DROP TYPE if exists enum_status;");
  }
};