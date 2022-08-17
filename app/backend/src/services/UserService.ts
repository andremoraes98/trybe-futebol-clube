import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import User from '../database/models/User';
import { UserCredential, Token } from '../interfaces/Username';

const secret = process.env.JWT_SECRET || 'secret';

export interface IUserService {
  login(credentials: UserCredential): Promise<Token>,
}

export default class UserService implements IUserService {
  private checkIfPasswordMatchesEmail = async (credentials: UserCredential): Promise<boolean> => {
    const { email, password } = credentials;
    const result = await User.findOne({
      where: {
        email,
      },
    });

    return result ? bcrypt.compareSync(password, result.password) : false;
  };

  login = async (credentials: UserCredential) => {
    const { email } = credentials;
    const willGenerateToken = await this.checkIfPasswordMatchesEmail(credentials);

    if (willGenerateToken) {
      const token = jwt.sign({ email }, secret);
      return { token };
    } throw new Error('Incorrect email or password');
  };
}
