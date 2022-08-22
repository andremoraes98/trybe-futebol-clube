import { Request, Response, Router } from 'express';
import MatchController from '../controller/MatchController';
import MatchService from '../services/MatchService';

const matchService = new MatchService();
const mathController = new MatchController(matchService);

const route = Router();

route.get('/', (req: Request, res: Response) => mathController.getAll(req, res));

route.post('/', (req: Request, res: Response) => mathController.create(req, res));

export default route;
