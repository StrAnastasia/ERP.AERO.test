import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokensEntity } from './tokens.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

const JWT_TOKEN = 'DEV_JWT_TOKEN';
export const bearerPrefix = 'Bearer ';

const TokensErrors = {
  RefreshTokenExpired: 'refresh token expired, login again',
};

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokensEntity)
    private readonly tokenRepository: Repository<TokensEntity>,
  ) {}

  async create(userId: number) {
    const bearerToken = this.generateBearerToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    const tokens = await this.tokenRepository.create({
      bearerToken,
      refreshToken,
    });
    await this.tokenRepository.save(tokens);
    return {
      bearerToken: bearerPrefix + tokens.bearerToken,
      refreshToken: tokens.refreshToken,
    };
  }

  isTokenValid(token: string) {
    try {
      return jwt.verify(token, JWT_TOKEN);
    } catch (error) {
      console.log(error);
    }
  }

  async updateWithRefreshToken(refreshToken: string) {
    const res = this.isTokenValid(refreshToken);
    const oldPair = await this.tokenRepository.findOne({
      where: { refreshToken },
    });
    const bearerToken = this.generateBearerToken(res.userId);

    const tokens = await this.tokenRepository.save({ ...oldPair, bearerToken });
    return {
      bearerToken: bearerPrefix + tokens.bearerToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async checkIfBTValid(bearerToken: string) {
    const foundTokenPair = await this.tokenRepository.findBy({
      bearerToken: bearerToken.replace(bearerPrefix, ''),
    });
    const isAuth = this.isTokenValid(bearerToken.replace(bearerPrefix, ''));

    if (!isAuth || !foundTokenPair.length)
      throw Error(TokensErrors.RefreshTokenExpired);
  }

  async deleteTokenPair(tokens: { bearerToken: string; refreshToken: string }) {
    const where = {
      bearerToken: tokens.bearerToken?.replace(bearerPrefix, ''),
      refreshToken: tokens.refreshToken,
    };
    const pair = await this.tokenRepository.find({ where });
    return await this.tokenRepository.remove(pair);
  }

  public generateBearerToken(userId: number): string {
    // 10 min
    return jwt.sign({ userId }, JWT_TOKEN, { expiresIn: 600 });
  }

  public generateRefreshToken(userId: number): string {
    return jwt.sign({ userId }, JWT_TOKEN, { expiresIn: '30d' });
  }
}
