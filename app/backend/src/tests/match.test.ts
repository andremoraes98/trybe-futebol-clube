import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { Response } from 'superagent';
import Match from '../database/models/Match';
import IMatch from '../interfaces/Match';

chai.use(chaiHttp);

const { expect } = chai;

const validMatchMock: IMatch = {
  id: 1,
  homeTeam: 1,
  awayTeam: 2,
  homeTeamGoals: 1,
  awayTeamGoals: 1,
  inProgress: false,
};

const equalTeamMatchMock: IMatch = {
  id: 1,
  homeTeam: 1,
  awayTeam: 1,
  homeTeamGoals: 1,
  awayTeamGoals: 1,
  inProgress: false,
};

const invalidTeamMatchMock: IMatch = {
  id: 1,
  homeTeam: 99999,
  awayTeam: 99999,
  homeTeamGoals: 1,
  awayTeamGoals: 1,
  inProgress: false,
};

const tokenMock: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwiaWF0IjoxNjYxMzcyNDk5fQ.emwXcTJCOaxWKYJ1FsZjzDf7auIRKC5FJlBisZhF0MU';

describe('GET: /matches', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Match, 'findAll')
      .resolves([validMatchMock as Match]);
  });

  afterEach(() => {
    sinon.restore();
  })

  it('espera que retorne um status 200.', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches');

    expect(chaiHttpResponse.status).to.equal(200);
  });
});

describe('POST: /matches', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Match, 'create')
      .resolves(validMatchMock as Match);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('espera que retorne um status 401 se não for fornecido um token;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches');

    expect(chaiHttpResponse.status).to.equal(401);
  });

  it('espera que retorne um status 404 se algum time da partida for inválido;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', tokenMock)
      .send(invalidTeamMatchMock);

    expect(chaiHttpResponse.status).to.equal(404);
  });

  it('espera que retorne um status 401 se os times da partida forem iguais;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', tokenMock)
      .send(equalTeamMatchMock);

    expect(chaiHttpResponse.status).to.equal(401);
  });

  it('espera que retorne um status 201 se a partida for criada.', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', tokenMock)
      .send(validMatchMock);

    expect(chaiHttpResponse.status).to.equal(201);
  });
});

describe('PATCH: /matches/:id/finish', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Match, 'update')
      .resolves();
  });

  afterEach(() => {
    sinon.restore();
  })

  it('espera que retorne um status 400 se o ID informado não for um número.', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/NaN/finish');

    expect(chaiHttpResponse.status).to.equal(400);
  });

  it('espera que retorne um status 200;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1/finish');

    expect(chaiHttpResponse.status).to.equal(200);
  });
});

describe('PATCH: /matches/:id', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Match, 'update')
      .resolves();
  });

  afterEach(() => {
    sinon.restore();
  })

  it('espera que retorne um status 400 se o ID informado não for um número.', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/NaN');

    expect(chaiHttpResponse.status).to.equal(400);
  });

  it('espera que retorne um status 200;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1');

    expect(chaiHttpResponse.status).to.equal(200);
  });
});
