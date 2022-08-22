import Team from '../database/models/Team';
import Match from '../database/models/Match';
import { CustomError } from '../middleware/errorMiddleware';

export interface IMatchService {
  getAll(): Promise<Match[]>;
  create(match: Match): Promise<Match>;
  updateFinish(id: number): Promise<void>;
}

export default class MatchService implements IMatchService {
  getAll = async () => {
    const result = await Match.findAll({
      include: [{
        model: Team,
        as: 'teamHome',
        attributes: { exclude: ['id'] },
      },
      {
        model: Team,
        as: 'teamAway',
        attributes: { exclude: ['id'] },
      },
      ],
    });

    return result;
  };

  create = async (match: Match) => {
    const createMatch = {
      ...match,
      inProgress: true,
    };

    const result = await Match.create(createMatch);

    return result;
  };

  updateFinish = async (id: number) => {
    if (Number.isNaN(id)) {
      throw new CustomError('ValidationError', 'Id must be a number');
    }

    await Match.update({ inProgress: false }, {
      where: {
        id,
      },
    });
  };
}
