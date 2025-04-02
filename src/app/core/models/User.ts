export class User {
  public id: string;
  public username: string;
  public email: string;
  public role: string[];
  public authStatus: string;

  constructor(
    id?: string,
    username?: string,
    email?: string,
    role?: string[],
    authStatus?: string
  ) {
    this.role = role || [];
    this.authStatus = authStatus || '';
    this.id = id || '';
    this.username = username || '';
    this.email = email || '';
  }
}
