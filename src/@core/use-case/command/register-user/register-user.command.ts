import { IsNotEmpty } from 'class-validator';
import { Command, CommandProps } from '@lib/domain/command.base';

export interface CreateUserResponseDto {
  bearerToken: string;
  refreshToken: string;
}

export class CreateUserCommand extends Command {
  @IsNotEmpty()
  readonly id: string;
  @IsNotEmpty()
  readonly password: string;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);

    this.password = props.password;
    this.id = props.id || null;
  }
}
