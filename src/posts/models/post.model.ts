import { Table, Column, Model, ForeignKey, DataType, BelongsTo,PrimaryKey,Default, BeforeFind } from 'sequelize-typescript';
import { DataTypes, Optional } from 'sequelize';
import { User } from '../../users/models/user.model';

export interface PostAttributes {
  id?: string;  // Change to string for UUID
  title: string;
  content: string;
  userId: string;
}

export interface PostCreationAttributes extends Optional<PostAttributes, 'id'> { }

@Table({
  tableName: 'posts',
  timestamps: true
})
export class Post extends Model<PostAttributes, PostCreationAttributes> {

  @PrimaryKey
  @Default(DataType.UUIDV4)  // Automatically generate UUIDs
  @Column({
    type: DataType.UUID,  // Set the type to UUID
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  })
  id!: string;  // Make the id field a string type to hold the UUID


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @ForeignKey(() => User)
  @Column
  userId!: string;

  @BelongsTo(() => User)
  user!: User;


  
}
