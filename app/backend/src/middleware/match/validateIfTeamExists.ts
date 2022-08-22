import { NextFunction, Request, Response } from 'express';
import TeamService from '../../services/TeamService';
import { CustomError } from '../errorMiddleware';

const teamService = new TeamService();

const validateIfTeamsExist = async (req: Request, res: Response, next: NextFunction) => {
  const { homeTeam, awayTeam } = req.body;
  const teams = await teamService.getAll();
  const teamsId = teams.map((team) => team.id);

  if (!(teamsId.includes(homeTeam) && teamsId.includes(awayTeam))) {
    throw new CustomError('InvalidTeam', 'There is no team with such id!');
  }

  next();
};

export default validateIfTeamsExist;
