import User from '../database/models/User';
import Jwt from '../jwt/Jwt';
import { UserCredential, Token } from '../interfaces/Username';
import Payload from '../interfaces/Payload';

const jwt = new Jwt();

export interface IUserService {
  login(credentials: UserCredential): Promise<Token>,
}

export default class UserService implements IUserService {
  login = async (credentials: UserCredential) => {
    const { email } = credentials;
    const result = await User.findOne({
      where: {
        email,
      },
      raw: true,
    }) as User;

    const payload: Payload = {
      id: result.id,
      email: result.email,
    };

    const token = await jwt.encode(payload);

    return { token };
  };
}
