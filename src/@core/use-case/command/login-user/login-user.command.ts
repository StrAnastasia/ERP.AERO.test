import { IsNotEmpty } from 'class-validator';
import { Command, CommandProps } from '@lib/domain/command.base';

export interface LoginUserResponseDto {
  bearerToken: string;
  refreshToken: string;
}

export class LoginUserCommand extends Command {
  @IsNotEmpty()
  readonly id: string;
  @IsNotEmpty()
  readonly password: string;

  constructor(props: CommandProps<LoginUserCommand>) {
    super(props);

    this.password = props.password;
    this.id = props.id || null;
  }
}
