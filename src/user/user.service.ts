import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './user.entity';
import { UserDataForDb, UserDtoWithRefresh } from './user.dto';
import { TokenService, bearerPrefix } from '../tokens/token.service';
import { errorMessages } from '../errors/messages-and-codes';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async create({ login, password }: UserDataForDb) {
    try {
      const salt = bcrypt.genSaltSync();

      if (login.includes('@')) {
        this.isEmailValid(login);
      } else {
        this.isPhonenumberValid(login);
      }

      const user = await this.userRepository.create({
        login: login,
        password: bcrypt.hashSync(password, salt),
      });
      const createdUSer = await this.userRepository.save(user);

      return await this.tokenService.create(createdUSer.id);
    } catch (error) {
      const message = (error as Error).message.toLowerCase();

      if (message.includes('duplicate')) {
        throw Error(errorMessages.UserAlreadyExists);
      } else {
        throw Error(message);
      }
    }
  }

  async login({ login, password }: UserDataForDb) {
    const user = await this.userRepository.findOne({ where: { login } });
    if (user === null) throw new Error(errorMessages.UserNotFound);

    if (bcrypt.compareSync(password, user.password)) {
      return this.tokenService.create(user.id);
    } else {
      throw Error(errorMessages.InvalidPassword);
    }
  }

  async refreshAuthToken({
    login,
    password,
    refreshToken,
  }: UserDtoWithRefresh) {
    const { userId } = this.tokenService.isTokenValid(refreshToken);

    const user = await this.userRepository.findOne({ where: { login } });
    if (user === null) throw new Error(errorMessages.UserNotFound);

    if (userId === user.id) {
      if (bcrypt.compareSync(password, user.password)) {
        return this.tokenService.updateWithRefreshToken(refreshToken);
      } else {
        throw new Error(errorMessages.InvalidPassword);
      }
    } else {
      throw new Error(errorMessages.RefreshTokenExpired);
    }
  }

  async findOne(tokens: { bearerToken: string; refreshToken: string }) {
    await this.tokenService.checkIfBTValid(tokens.bearerToken);

    let userId: number;
    const bearerToken = tokens.bearerToken?.replace(bearerPrefix, '');
    const BTData = this.tokenService.isTokenValid(bearerToken);
    if (BTData) {
      userId = BTData.userId;
    } else {
      const RTData = this.tokenService.isTokenValid(bearerToken);
      if (RTData) userId = RTData.userId;
      else throw new Error(errorMessages.RefreshTokenExpired);
    }
    const { login } = await this.userRepository.findOne({
      where: { id: userId },
    });
    return { id: login };
  }

  async logout(tokens: { bearerToken: string; refreshToken: string }) {
    try {
      await this.tokenService.checkIfBTValid(tokens.bearerToken);

      await this.tokenService.deleteTokenPair(tokens);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  isEmailValid(email: string) {
    const res = /\S+@\S+\.\S+/.test(email);
    if (!res) throw new Error(errorMessages.InvalidEmail);
  }

  isPhonenumberValid(phone: string) {
    const digits = phone
      .replaceAll('+', '')
      .replaceAll(' ', '')
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('-', '');
    const sliced = digits.match(/\d*/)[0];

    if (sliced !== digits) throw new Error(errorMessages.InvalidPhone);
  }
}
