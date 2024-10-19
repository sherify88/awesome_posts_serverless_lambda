'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
  await queryInterface.addColumn('users', 'role', {
    type: Sequelize.DataTypes.ENUM('admin', 'blogger', 'customer'),
    allowNull: false,
    defaultValue: 'customer',
  });

  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role');
  }
};
