import { Table, Column, Model, DataType, PrimaryKey, Default, BeforeFind, HasMany, AfterFind, BeforeCreate } from 'sequelize-typescript';
import { DataTypes, Optional } from 'sequelize';
import { Post } from '../../posts/models/post.model';
var bcrypt = require('bcryptjs');

export interface UserAttributes {
  id?: string;  // Change to string for UUID
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
  role?: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
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
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;


  @Column({
    type: DataType.ENUM('admin', 'blogger', 'customer'),  // Define possible roles
    allowNull: false,
    defaultValue: 'customer',
  })
  role!: string;  // Add a role field

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

  @HasMany(() => Post)  // Add this line to define the association
  posts!: Post[];  // Ensure this is an array of Post

  @AfterFind
  static hideEmail(users: User | User[]) {
    // Check if 'users' is an array or a single instance
    if (Array.isArray(users)) {
      // If it's an array, hide email for each user
      users.forEach(user => user.email = 'hidden');
    } else {
      // If it's a single instance, hide the email directly
      if (!users) return;
      users.email = 'hidden';
    }
  }

  // Hash password before saving the user
  @BeforeCreate
  static async hashPassword(instance: User) {
    const salt = await bcrypt.genSaltSync(10);
    instance.password = await bcrypt.hashSync(instance.password, salt);
  }

  // Method to compare passwords
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }

}
