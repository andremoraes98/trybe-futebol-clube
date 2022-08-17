import { Model, STRING, NUMBER } from 'sequelize';
import IUser from '../../interfaces/Username';
import db from '.';
// import OtherModel from './OtherModel';

class User extends Model implements IUser {
  id!: number;
  username!: string;
  role!: 'user' | 'admin';
  email!: string;
  password!: string;
}

User.init({
  id: {
    type: NUMBER,
    primaryKey: true,
  },
  username: {
    type: STRING,
    allowNull: false,
  },
  role: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
}, {
  modelName: 'Users',
  underscored: true,
  sequelize: db,
  timestamps: false,
});

export default User;
