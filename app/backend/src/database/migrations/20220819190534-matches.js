'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      homeTeam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'home_team',
        references: {
          model: {
            tableName: 'teams',
          },
          key: 'id'
        },
      },
      homeTeamGoals: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'home_team_goals',
      },
      awayTeam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'away_team',
        references: {
          model: {
            tableName: 'teams',
          },
          key: 'id'
        },
      },
      awayTeamGoals: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'away_team_goals',
      },
      inProgress: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'in_progress',
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('matches');
  }
};
