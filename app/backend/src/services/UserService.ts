import User from '../database/models/User';
import Jwt from '../jwt/Jwt';
import { UserCredential, Token } from '../interfaces/Username';
import Payload from '../interfaces/Payload';
import { CustomError } from '../middleware/errorMiddleware';

const jwt = new Jwt();

export interface IUserService {
  login(credentials: UserCredential): Promise<Token>,
  validate(token: string): Promise<string>,
  getById(id: number): Promise<User>,
}

export default class UserService implements IUserService {
  login = async (credentials: UserCredential) => {
    const { email } = credentials;
    const user = await User.findOne({
      where: {
        email,
      },
      raw: true,
    }) as User;

    const payload: Payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.encode(payload);

    return { token };
  };

  validate = async (token: string) => {
    const { id } = jwt.decode(token);

    const user = await User.findOne({
      where: {
        id,
      },
      raw: true,
    }) as User;

    return user.role;
  };

  getById = async (id: number): Promise<User> => {
    if (Number.isNaN(id)) {
      throw new CustomError('ValidationError', 'Id must be a number');
    }

    const user = await User.findOne({
      where: {
        id,
      },
      raw: true,
    }) as User;

    return user;
  };
}
