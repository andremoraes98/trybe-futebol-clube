import { Model, STRING, NUMBER } from 'sequelize';
import ITeam from '../../interfaces/Team';
import db from '.';
// import OtherModel from './OtherModel';

class Team extends Model implements ITeam {
  id!: number;
  teamName!: string;
}

Team.init({
  id: {
    type: NUMBER,
    primaryKey: true,
  },
  teamName: {
    type: STRING,
    allowNull: false,
  },
}, {
  modelName: 'Teams',
  underscored: true,
  sequelize: db,
  timestamps: false,
});

export default Team;
