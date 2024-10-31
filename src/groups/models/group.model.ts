import { Table, Column, Model, PrimaryKey, DataType, BelongsToMany, Default } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { UserGroup } from './userGroup.model';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'groups',
  timestamps: true,
})
export class Group extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4) 
    @Column({
      type: DataType.UUID, 
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    })
    id!: string;  

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @BelongsToMany(() => User, () => UserGroup) 
  users!: User[];
}
