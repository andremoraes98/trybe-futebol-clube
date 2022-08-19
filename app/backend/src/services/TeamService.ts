import Team from '../database/models/Team';
import { CustomError } from '../middleware/errorMiddleware';

export interface ITeamService {
  getAll(): Promise<Team[]>;
  getById(id: number): Promise<Team>;
}

export default class TeamService implements ITeamService {
  getAll = async (): Promise<Team[]> => {
    const result = await Team.findAll({ raw: true });

    return result;
  };

  getById = async (id: number): Promise<Team> => {
    if (Number.isNaN(id)) {
      throw new CustomError('ValidationError', 'Id must be a number');
    }

    const team = await Team.findOne({
      where: {
        id,
      },
      raw: true,
    }) as Team;

    return team;
  };
}
