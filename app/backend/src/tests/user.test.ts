import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';
import IUser, { Token } from '../interfaces/Username';
import * as jwt from 'jsonwebtoken';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const userMock: IUser = {
  id: 1,
  email: 'user@user.com',
  password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
  role: 'user',
  username: 'username',
}

const tokenMock: string = 'token';

describe('/login', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(User, 'findOne')
      .resolves(userMock as User);
    sinon
      .stub(jwt, 'sign')
      .resolves(tokenMock);
  });

  afterEach(() => {
    sinon.restore();
  })

  it('espera que retorne um status 200;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'user@user.com',
        password: 'secret_user',
      });

    expect(chaiHttpResponse.status).to.equal(200);
  });

  it('espera que seja retornado um token;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'user@user.com',
        password: 'secret_user',
      });

    expect(chaiHttpResponse.body).to.be.an('object').with.key('token');
  });

  it('espera que retorne um status 400 se não for informado email ou password;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'user@user.com',
      });

      expect(chaiHttpResponse.status).to.equal(400);
  });

  it('espera que retorne um status 401 se o email for inválido;', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'wrong@wrong.com',
        password: 'secret_user',
      });

      expect(chaiHttpResponse.status).to.equal(401);
  });

  it('espera que retorne um status 401 se a senha for inválida.', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({
        email: 'user@user.com',
        password: 'wrong_password',
      });

      expect(chaiHttpResponse.status).to.equal(401);
  });
});
