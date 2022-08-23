import { Request, Response } from 'express';
import { IHomeLeaderService } from '../services/HomeLeaderService';

export default class HomeLeaderController {
  constructor(private matchService: IHomeLeaderService) { }

  getHomeClassification = async (req: Request, res: Response) => {
    const result = await this.matchService.getHomeClassification();

    res.status(200).json(result);
  };
}
