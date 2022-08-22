/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response, NextFunction } from 'express';

export class CustomError extends Error {
  public name: string;

  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

const errors: Record<string, number> = {
  InvalidCredential: 401,
  ValidationError: 400,
  EqualTeam: 401,
  InvalidTeam: 404,
  InvalidToken: 401,
  JsonWebTokenError: 401,
};

const errorMiddleware = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { message, name } = err;
  const httpStatus = errors[name];

  if (name === 'JsonWebTokenError') {
    return res.status(httpStatus).json({ message: 'Token must be a valid token' });
  } if (httpStatus) {
    return res.status(httpStatus).json({ message });
  } return res.status(500).json(err);
};

export default errorMiddleware;
