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
};

const errorMiddleware = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { message, name } = err;
  const httpStatus = errors[name];

  if (httpStatus) {
    return res.status(httpStatus).json({ message });
  } return res.status(500).json({ message });
};

export default errorMiddleware;
