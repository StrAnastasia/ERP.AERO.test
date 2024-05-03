import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokensEntity } from '../entity/tokens.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { errorMessages } from 'src/errors/messages-and-codes';

const JWT_TOKEN = process.env.JWT_TOKEN || 'DEV_JWT_TOKEN';
export const bearerPrefix = 'Bearer ';

@Injectable()
export class TokenRepository extends Repository<TokensEntity> {
  constructor(
    @InjectRepository(TokensEntity)
    private readonly tokenRepository: Repository<TokensEntity>,
  ) {
    super(
      tokenRepository.target,
      tokenRepository.manager,
      tokenRepository.queryRunner,
    );
  }

  async createTokenPair(userId: number) {
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

  isTokenValid(token: string): { userId: number } {
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

  async checkIfBTValid(bearerToken: string): Promise<{ userId: number }> {
    const foundTokenPair = await this.tokenRepository.findBy({
      bearerToken: bearerToken.replace(bearerPrefix, ''),
    });
    const isAuth = this.isTokenValid(bearerToken.replace(bearerPrefix, ''));

    if (!isAuth || !foundTokenPair.length)
      throw Error(errorMessages.RefreshTokenExpired);

    return isAuth;
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
