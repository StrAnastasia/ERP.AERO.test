import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;
  @Column()
  password: string;

  @OneToMany(() => UserEntity, (userEntity) => userEntity.tokenPairId)
  tokenPairId: number[];
}
