import { RegisterUserUseCase } from './register-user/register-user.use-case';
import { LoginUserUseCase } from './login-user/login-user.use-case';
import { RefreshTokensUseCase } from './refresh-tokens/refresh-tokens.use-case';
import { LogoutUseCase } from './logout/logout.use-case';
import { UploadFileUseCase } from './upload-file/upload-file.use-case';
import { UpdateFileUseCase } from './update-file/update-file.use-case';
import { DeleteFileUseCase } from './delete-file/delete-file.use-case';

export { RegisterUserUseCase } from './register-user/register-user.use-case';
export { LoginUserUseCase } from './login-user/login-user.use-case';
export { RefreshTokensUseCase } from './refresh-tokens/refresh-tokens.use-case';
export { LogoutUseCase } from './logout/logout.use-case';
export { UploadFileUseCase } from './upload-file/upload-file.use-case';
export { UpdateFileUseCase } from './update-file/update-file.use-case';
export { DeleteFileUseCase } from './delete-file/delete-file.use-case';

export const commands = [
  RegisterUserUseCase,
  LoginUserUseCase,
  RefreshTokensUseCase,
  LogoutUseCase,
  UploadFileUseCase,
  UpdateFileUseCase,
  DeleteFileUseCase,
];
