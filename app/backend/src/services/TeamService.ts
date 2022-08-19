import Team from '../database/models/Team';

export interface ITeamService {
  getAll(): Promise<Team[]>
}

export default class TeamService implements ITeamService {
  getAll = async (): Promise<Team[]> => {
    const result = await Team.findAll({ raw: true });

    return result;
  };
}
