import { IsNotEmpty } from 'class-validator';
import { Command, CommandProps } from '@lib/domain/command.base';

export interface UpdateFileResponseDto {
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  dateCreated: Date;
  dateUpdated: Date;
}

export class UpdateFileCommand extends Command {
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;
  @IsNotEmpty()
  file: Express.Multer.File;
  @IsNotEmpty()
  id: number;

  constructor(props: CommandProps<UpdateFileCommand>) {
    super(props);

    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
    this.file = props.file;
    this.id = props.id;
  }
}
