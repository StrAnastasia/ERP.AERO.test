import { IsNotEmpty } from 'class-validator';
import { Command, CommandProps } from '@lib/domain/command.base';

export interface RefreshTokensResponseDto {
  bearerToken: string;
  refreshToken: string;
}

export class RefreshTokensCommand extends Command {
  @IsNotEmpty()
  readonly id: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;

  constructor(props: CommandProps<RefreshTokensCommand>) {
    super(props);

    this.password = props.password;
    this.id = props.id;
    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
  }
}
