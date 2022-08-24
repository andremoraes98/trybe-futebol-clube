import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { Response } from 'superagent';
import Team from '../database/models/Team';
import ITeam from '../interfaces/Team';

chai.use(chaiHttp);

const { expect } = chai;

const teamMock: ITeam = {
  id: 2,
  teamName: 'Bahia',
};

describe('/teams', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Team, 'findAll')
      .resolves([teamMock as Team]);
  });

  afterEach(() => {
    sinon.restore();
  })

  it('espera que retorne um status 200.', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/teams');

    expect(chaiHttpResponse.status).to.equal(200);
  });
});

describe('/teams/:id', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Team, 'findOne')
      .resolves(teamMock as Team);
  });

  afterEach(() => {
    sinon.restore();
  })

  it('espera que retorne um status 200;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/1');

    expect(chaiHttpResponse.status).to.equal(200);
  });

  it('espera que retorne um status 400 se o ID informado não for um número.', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/NaN');

    expect(chaiHttpResponse.status).to.equal(400);
  });
});
