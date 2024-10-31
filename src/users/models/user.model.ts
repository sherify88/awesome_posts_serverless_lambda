import { Table, Column, Model, DataType, PrimaryKey, Default, BeforeFind, HasMany, AfterFind, BeforeCreate } from 'sequelize-typescript';
import { BelongsToMany } from 'sequelize-typescript';
import { DataTypes, Optional } from 'sequelize';
import { Post } from '../../posts/models/post.model';
import { Group } from '../../groups/models/group.model';
import { UserGroup } from '../../groups/models/userGroup.model';
var bcrypt = require('bcryptjs');

export interface UserAttributes {
  id?: string;  
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
  role?: string;
  version?: number;  
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

@Table({
  tableName: 'users',
  timestamps: true,
  version: true  
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
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
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;

  @Column({
    type: DataType.ENUM('admin', 'blogger', 'customer'),  
    allowNull: false,
    defaultValue: 'customer',
  })
  role!: string; 

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false
  })
  isActive!: boolean;

  @HasMany(() => Post)  
  posts!: Post[];  

  @BelongsToMany(() => Group, () => UserGroup)
  groups!: Group[];
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,  
  })
  version!: number;

  @AfterFind
  static hideEmail(users: User | User[]) {
    if (Array.isArray(users)) {
      users.forEach(user => user.email = 'hidden');
    } else {
      if (!users) return;
      users.email = 'hidden';
    }
  }

  @BeforeCreate
  static async hashPassword(instance: User) {
    const salt = await bcrypt.genSaltSync(10);
    instance.password = await bcrypt.hashSync(instance.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }


    public addGroups!: (group: Group | Group[], options?: any) => Promise<void>;
    public getGroups!: () => Promise<Group[]>;
    public setGroups!: (groups: Group[]) => Promise<void>;
    public removeGroup!: (group: Group | Group[]) => Promise<void>;
}
