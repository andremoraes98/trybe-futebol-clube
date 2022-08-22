import { Model, NUMBER, BOOLEAN } from 'sequelize';
import db from '.';
import Team from './Team';
// import OtherModel from './OtherModel';

class Match extends Model {
  id!: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

Match.init({
  id: {
    type: NUMBER,
    primaryKey: true,
    autoIncrement: true,
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
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  modelName: 'Matches',
  underscored: true,
  sequelize: db,
  timestamps: false,
});

Match.belongsTo(Team, {
  foreignKey: 'homeTeam',
  as: 'teamHome',
});

Match.belongsTo(Team, {
  foreignKey: 'awayTeam',
  as: 'teamAway',
});

export default Match;
