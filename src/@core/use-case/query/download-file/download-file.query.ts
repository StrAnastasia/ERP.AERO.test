import { IsNotEmpty } from 'class-validator';
import { QueryProps, Query } from '@lib/domain/query.base';

export class DownloadFileQuery extends Query {
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;
  @IsNotEmpty()
  readonly id: number;

  constructor(props: QueryProps<DownloadFileQuery>) {
    super(props);

    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
    this.id = props.id;
  }
}
