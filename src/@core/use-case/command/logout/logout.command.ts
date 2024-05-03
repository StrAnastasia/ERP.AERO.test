import { IsNotEmpty } from 'class-validator';
import { Command, CommandProps } from '@lib/domain/command.base';

export interface LogoutResponseDto {
  success: boolean;
}

export class LogoutCommand extends Command {
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;

  constructor(props: CommandProps<LogoutCommand>) {
    super(props);

    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
  }
}
