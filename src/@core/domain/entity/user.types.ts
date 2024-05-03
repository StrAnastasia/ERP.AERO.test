export interface CreateOrLoginUserDto {
  id: string;
  password: string;
}

export interface UserDataForDb {
  login: string;
  password: string;
}

export interface UserDtoWithRefresh extends UserDataForDb {
  refreshToken: string;
}

export interface HeaderWithTokens {
  authorization: string;
  refresh_token: string;
}
