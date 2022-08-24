import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errorMiddleware';
import 'dotenv/config';
import Jwt from '../../jwt/Jwt';

const jwt = new Jwt();

const validateToken = async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization: token } = req.headers;

  if (!token) {
    throw new CustomError('InvalidToken', 'You must provide an access token!');
  }

  jwt.decode(token);

  next();
};

export default validateToken;
