export interface CreateOrLoginUserDto {
  id: string;
  password: string;
}

export interface UserDataForDb {
  login: string;
  password: string;
}

export interface UserDtoWithRefresh extends UserDataForDb {
  refresh: string;
  bearer?: string;
}

export interface HeaderWithTokens {
  headers: {
    authorization: string;
    refresh_token: string;
  };
}
