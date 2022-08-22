import { Request, Response, Router } from 'express';
import validateIfTeamAreEqual from '../middleware/match/validateIfTeamAreEqual';
import MatchController from '../controller/MatchController';
import MatchService from '../services/MatchService';
import validateIfTeamsExist from '../middleware/match/validateIfTeamExists';
import validateToken from '../middleware/user/validateToken';

const matchService = new MatchService();
const mathController = new MatchController(matchService);

const route = Router();

route.get('/', (req: Request, res: Response) => mathController.getAll(req, res));

route.post(
  '/',
  validateToken,
  validateIfTeamsExist,
  validateIfTeamAreEqual,
  (req: Request, res: Response) => mathController.create(req, res),
);

route.patch('/:id/finish', (req: Request, res: Response) => mathController.updateFinish(req, res));

export default route;
