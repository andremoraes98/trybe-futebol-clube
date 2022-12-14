import { Request, Response } from 'express';
import { IMatchService } from '../services/MatchService';

export default class MatchController {
  constructor(private matchService: IMatchService) { }

  getAll = async (_req: Request, res: Response) => {
    const result = await this.matchService.getAll();

    res.status(200).json(result);
  };

  create = async (req: Request, res: Response) => {
    const matchInfos = req.body;

    const result = await this.matchService.create(matchInfos);

    res.status(201).json(result);
  };

  updateFinish = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.matchService.updateFinish(Number(id));

    res.json({ message: 'Finished' });
  };

  updateGoals = async (req: Request, res: Response) => {
    const { id } = req.params;
    const goals = req.body;

    await this.matchService.updateGoals(Number(id), goals);

    res.json({ message: 'Goals updated!' });
  };
}
