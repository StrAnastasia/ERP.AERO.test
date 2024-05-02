import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class TokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bearerToken: string;
  @Column()
  refreshToken: string;

  @ManyToOne(() => TokensEntity, (tokensEntity) => tokensEntity.userId)
  userId: number;
}
