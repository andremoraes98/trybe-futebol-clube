export interface Indexable {
  id: number
}

export default interface IUser extends Indexable {
  username: string,
  password: string,
  role: 'user' | 'admin',
  email: string,
}
