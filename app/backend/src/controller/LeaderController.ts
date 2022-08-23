import { Request, Response } from 'express';
import { ILeaderService } from '../services/LeaderService';

export default class LeaderController {
  constructor(private matchService: ILeaderService) { }

  getAwayClassification = async (req: Request, res: Response) => {
    const result = await this.matchService.getClassification();

    res.status(200).json(result);
  };
}
