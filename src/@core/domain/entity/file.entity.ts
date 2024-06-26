import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  extension: string;
  @Column()
  mimeType: string;
  @Column()
  size: number;
  @Column({ nullable: false })
  fileForDownload: string;

  @CreateDateColumn()
  dateCreated: Date;
  @UpdateDateColumn()
  dateUpdated: Date;
}
