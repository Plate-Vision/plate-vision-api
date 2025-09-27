import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity {
  @ApiProperty({ description: 'Código de identificação do registro' })
  @PrimaryGeneratedColumn({ comment: 'Código de identificação do registro' })
  public id?: number;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    comment: 'Data de criação do registro',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt?: Date;

  @Exclude()
  @ApiProperty({ description: 'Data de edição do registro' })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    comment: 'Data de atualização do registro',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt?: Date;

  @Exclude()
  @ApiProperty({ description: 'Data de deleção do registro' })
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    comment: 'Data de deleção do registro',
  })
  public deletedAt?: Date;

  @ApiProperty({ description: 'UUID do registro' })
  @Column({
    type: 'uuid',
    unique: true,
    generated: 'uuid',
    comment: 'UUID do registro',
  })
  @Index()
  public uuid?: string;
}
