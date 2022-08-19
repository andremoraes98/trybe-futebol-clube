import { Request, Response, Router } from 'express';
import TeamController from '../controller/TeamController';
import TeamService from '../services/TeamService';

const teamService = new TeamService();
const teamController = new TeamController(teamService);

const router = Router();

router.get('/', (req: Request, res: Response) => teamController.getAll(req, res));
router.get('/:id', (req: Request, res: Response) => teamController.getById(req, res));

export default router;
