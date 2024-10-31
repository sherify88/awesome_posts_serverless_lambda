import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Group } from './group.model';
import { User } from '../../users/models/user.model';

@Table({
  tableName: 'user_groups',
  timestamps: false,
})
export class UserGroup extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  groupId!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  joinedAt!: Date;
}
