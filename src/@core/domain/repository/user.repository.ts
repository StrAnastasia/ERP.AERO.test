import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../entity/user.entity';
import { TokenRepository } from './token.repository';
import { errorMessages } from '../../../errors/messages-and-codes';
import { Injectable } from '@nestjs/common';
import {
  CreateOrLoginUserDto,
  UserDataForDb,
  UserDtoWithRefresh,
  HeaderWithTokens,
} from '../entity/user.types';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tokenRepo: TokenRepository,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async createUser({ login, password }: UserDataForDb) {
    try {
      const salt = bcrypt.genSaltSync();
      const user = this.create({
        login: login,
        password: bcrypt.hashSync(password, salt),
      });
      return this.save(user);
    } catch (error) {
      const message = (error as Error).message.toLowerCase();

      if (message.includes('duplicate')) {
        throw Error(errorMessages.UserAlreadyExists);
      } else {
        throw Error(message);
      }
    }
  }

  async refreshAuthToken({
    login,
    password,
    refreshToken,
  }: UserDtoWithRefresh) {
    const { userId } = this.tokenRepo.isTokenValid(refreshToken);

    const user = await this.userRepository.findOne({ where: { login } });
    if (user === null) throw new Error(errorMessages.UserNotFound);

    if (userId === user.id) {
      if (bcrypt.compareSync(password, user.password)) {
        return this.tokenRepo.updateWithRefreshToken(refreshToken);
      } else {
        throw new Error(errorMessages.InvalidPassword);
      }
    } else {
      throw new Error(errorMessages.RefreshTokenExpired);
    }
  }

  async findUserPseudoId(id: number) {
    const { login } = await this.userRepository.findOne({ where: { id } });
    return { id: login };
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

  idToLogin(dto: CreateOrLoginUserDto) {
    return { login: dto.id, password: dto.password };
  }

  reqToTokens(headers: HeaderWithTokens) {
    try {
      return {
        bearerToken: headers.authorization,
        refreshToken: headers.refresh_token,
      };
    } catch (err) {
      throw err;
    }
  }
}
