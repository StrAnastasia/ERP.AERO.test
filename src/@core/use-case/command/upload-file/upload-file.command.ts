import { IsNotEmpty } from 'class-validator';
import { Command, CommandProps } from '@lib/domain/command.base';

export interface UploadFileResponseDto {
  name: string;
  extension: string;
  mimeType: string;
  size: number;
  dateCreated: Date;
  dateUpdated: Date;
  id: number;
}

export class UploadFileCommand extends Command {
  @IsNotEmpty()
  readonly authorization: string;
  @IsNotEmpty()
  readonly refresh_token: string;
  @IsNotEmpty()
  file: {
    name: string;
    extension: string;
    mimeType: string;
    size: number;
    fileForDownload: string;
  };

  constructor(props: CommandProps<UploadFileCommand>) {
    super(props);

    this.authorization = props.authorization;
    this.refresh_token = props.refresh_token;
    this.file = { ...props.file };
  }
}
