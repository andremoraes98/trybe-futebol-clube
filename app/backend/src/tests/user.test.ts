import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User';
import IUser from '../interfaces/Username'

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/login', () => {
  let chaiHttpResponse: Response;

  const userMock: IUser = {
    id: 1,
    email: 'email@test.com',
    password: '123456',
    role: 'user',
    username: 'username',
  }

  before(async () => {
    sinon
      .stub(User, "findOne")
      .resolves(userMock as User);
  });

  after(()=>{
    (User.findOne as sinon.SinonStub).restore();
  })

  it('espera que retorne um status 200', async () => {
    chaiHttpResponse = await chai.request(app).post('/login');

    expect(chaiHttpResponse.status).to.equal(200);
  });

  it('espera que seja retornado um token', async () => {
    chaiHttpResponse = await chai.request(app).post('/login');

    expect(chaiHttpResponse.body).to.be.an('object').with.key('token');
  });
});
