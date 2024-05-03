import { IsNotEmpty } from 'class-validator';
import { QueryProps, Query } from '@lib/domain/query.base';

export interface UserInfoResponseDto {
  id: string;
}

export class UserInfoQuery extends Query {
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;

  constructor(props: QueryProps<UserInfoQuery>) {
    super(props);

    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
  }
}
