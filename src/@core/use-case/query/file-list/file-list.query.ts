import { IsNotEmpty } from 'class-validator';
import { QueryProps, Query } from '@lib/domain/query.base';

export interface FileListResponseDto {
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  dateUploaded: Date;
}

export class FileListQuery extends Query {
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;

  list_size?: number;
  page?: number;

  constructor(props: QueryProps<FileListQuery>) {
    super(props);

    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
    this.list_size = props.list_size;
    this.page = props.page;
  }
}
