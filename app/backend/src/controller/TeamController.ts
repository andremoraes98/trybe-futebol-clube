import { Request, Response } from 'express';
import { ITeamService } from '../services/TeamService';

export default class TeamController {
  constructor(private teamService: ITeamService) {}

  getAll = async (_req: Request, res: Response) => {
    const result = await this.teamService.getAll();

    res.status(200).json(result);
  };
}
