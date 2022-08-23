import { Request, Response } from 'express';
import { IAwayLeaderService } from '../services/AwayLeaderService';

export default class AwayLeaderController {
  constructor(private matchService: IAwayLeaderService) { }

  getAwayClassification = async (req: Request, res: Response) => {
    const result = await this.matchService.getAwayClassification();

    res.status(200).json(result);
  };
}
