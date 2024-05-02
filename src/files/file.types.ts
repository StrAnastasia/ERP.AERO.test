export interface CreateFileDto {
  name: string;
  extension: string;
  mimeType: string;
  size: number;
}

export interface FileResponse {
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  bearerToken?: string;
  refreshToken?: string;
}

export interface UpdateFileDto {
  name?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
}

export interface FindFilesDto {
  list_size?: number;
  page?: number;
}

export interface HeaderWithTokens {
  headers: {
    authorization: string;
    refresh_token: string;
  };
}
