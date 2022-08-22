import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errorMiddleware';
import 'dotenv/config';
import Jwt from '../../jwt/Jwt';
import UserService from '../../services/UserService';

const jwt = new Jwt();
const userService = new UserService();

const validateToken = async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization: token } = req.headers;

  if (!token) {
    throw new CustomError('InvalidToken', 'You must provide an access token!');
  }

  const payload = jwt.decode(token);

  const user = await userService.getById(payload.id);

  if (payload.email !== user.email) {
    throw new CustomError('InvalidToken', 'Token must be a valid token');
  }

  next();
};

export default validateToken;
