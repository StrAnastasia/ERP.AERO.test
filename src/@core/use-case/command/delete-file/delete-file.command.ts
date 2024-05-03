import { IsNotEmpty } from 'class-validator';
import { Command, CommandProps } from '@lib/domain/command.base';

export interface DeleteFileResponseDto {
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  dateCreated: Date;
  dateUpdated: Date;
}

export class DeleteFileCommand extends Command {
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;
  @IsNotEmpty()
  id: number;

  constructor(props: CommandProps<DeleteFileCommand>) {
    super(props);

    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
    this.id = props.id;
  }
}
