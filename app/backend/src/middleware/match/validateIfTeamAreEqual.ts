import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errorMiddleware';

const validateIfTeamAreEqual = (req: Request, _res: Response, next: NextFunction) => {
  const { homeTeam, awayTeam } = req.body;

  if (homeTeam === awayTeam) {
    throw new CustomError('EqualTeam', 'It is not possible to create a match with two equal teams');
  }

  next();
};

export default validateIfTeamAreEqual;
