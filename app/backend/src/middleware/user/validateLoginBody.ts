import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import User from '../../database/models/User';
import { CustomError } from '../errorMiddleware';

const validateBody = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new CustomError('ValidationError', 'All fields must be filled');
  }

  next();
};

const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const result = await User.findOne({
    where: {
      email,
    },
    raw: true,
  });

  if (result?.email !== email) {
    throw new CustomError('InvalidCredential', 'Incorrect email or password');
  }

  next();
};

const validatePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const result = await User.findOne({
    where: {
      email,
    },
    raw: true,
  }) as User;

  if (!bcrypt.compareSync(password, result.password)) {
    throw new CustomError('InvalidCredential', 'Incorrect email or password');
  }

  next();
};

export {
  validateBody,
  validateEmail,
  validatePassword,
};
