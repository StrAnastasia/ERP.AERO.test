import { UserInfoUseCase } from './user-info/user-info.use-case';
import { FileListUseCase } from './file-list/file-list.use-case';
import { DownloadFileUseCase } from './download-file/download-file.use-case';
import { GetFileDataUseCase } from './get-file-data/get-file-data.use-case';

export { UserInfoUseCase } from './user-info/user-info.use-case';
export { FileListUseCase } from './file-list/file-list.use-case';
export { DownloadFileUseCase } from './download-file/download-file.use-case';
export { GetFileDataUseCase } from './get-file-data/get-file-data.use-case';

export const queries = [
  UserInfoUseCase,
  FileListUseCase,
  DownloadFileUseCase,
  GetFileDataUseCase,
];
