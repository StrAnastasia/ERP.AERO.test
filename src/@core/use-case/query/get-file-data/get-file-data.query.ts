import { IsNotEmpty } from 'class-validator';
import { QueryProps, Query } from '@lib/domain/query.base';

export interface GetFileDataResponseDto {
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  dateUploaded: Date;
}

export class GetFileDataQuery extends Query {
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;
  @IsNotEmpty()
  id?: number;

  constructor(props: QueryProps<GetFileDataQuery>) {
    super(props);

    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
    this.id = props.id;
  }
}
