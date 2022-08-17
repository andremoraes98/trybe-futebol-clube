export interface Token {
  token: string
}

export interface Indexable {
  id: number
}

export interface UserCredential {
  email: string,
  password: string,
}

export default interface IUser extends Indexable, UserCredential {
  username: string,
  role: 'user' | 'admin',
}
