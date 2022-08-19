import { Request, Response } from 'express';
import { IMatchService } from '../services/MatchService';

export default class MatchController {
  constructor(private matchService: IMatchService) { }

  getAll = async (_req: Request, res: Response) => {
    const result = await this.matchService.getAll();

    res.status(200).json(result);
  };
}
