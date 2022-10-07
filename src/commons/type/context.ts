export interface IUser {
  user: {
    email?: string;
    account?: string;
    id: string;
  };
  // headers 에서 tokens 추출을 위햔 interface
  headers?: {
    authorization?: string;
    cookie?: string;
  };
}

export interface IContext {
  req?: Request & IUser;
  res?: Response;
}
