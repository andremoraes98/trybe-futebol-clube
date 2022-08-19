import { Model, NUMBER } from 'sequelize';
import db from '.';
import Team from './Team';
// import OtherModel from './OtherModel';

class Matches extends Model {
  id!: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: number;
}

Matches.belongsTo(Team, {
  foreignKey: 'home_team',
});

Matches.belongsTo(Team, {
  foreignKey: 'away_team',
});

Matches.init({
  id: {
    type: NUMBER,
    primaryKey: true,
  },
  homeTeam: {
    type: NUMBER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: NUMBER,
    allowNull: false,
  },
  awayTeam: {
    type: NUMBER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: NUMBER,
    allowNull: false,
  },
  inProgress: {
    type: NUMBER,
    allowNull: false,
  },
}, {
  modelName: 'Matches',
  underscored: true,
  sequelize: db,
  timestamps: false,
});

export default Matches;
