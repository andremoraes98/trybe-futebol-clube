import * as jwt from 'jsonwebtoken';
import Payload from '../interfaces/Payload';
import 'dotenv/config';

const secret = process.env.JWT_SECRET || 'secret';

export default class Jwt {
  encode = async (payload: Payload): Promise<string> => {
    const token = jwt.sign(payload, secret);

    return token;
  };

  decode = async (token: string): Promise<Payload> => {
    const { email, id } = jwt.verify(token, secret) as Payload;

    return { email, id };
  };
}
