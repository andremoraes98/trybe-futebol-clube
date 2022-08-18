import * as jwt from 'jsonwebtoken';
import User from '../database/models/User';
import { UserCredential, Token } from '../interfaces/Username';

const secret = process.env.JWT_SECRET || 'secret';

export interface IUserService {
  login(credentials: UserCredential): Promise<Token>,
}

export default class UserService implements IUserService {
  private checkIfEmailMatches = async (credentials: UserCredential): Promise<boolean> => {
    const { email } = credentials;
    const result = await User.findOne({
      where: {
        email,
      },
      raw: true,
    });

    return result ? result.email === email : false;
  };

  login = async (credentials: UserCredential) => {
    const { email } = credentials;
    const token = jwt.sign({ email }, secret);

    return { token };
  };
}
