import Team from '../database/models/Team';
import Match from '../database/models/Match';

export interface IMatchService {
  getAll(): Promise<Match[]>;
  create(match: Match): Promise<Match>;
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
}
