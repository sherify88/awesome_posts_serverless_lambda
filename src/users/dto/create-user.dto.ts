import { IsString, IsEmail, IsArray, ValidateNested, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePostDto } from '../../posts/dto/create-post.dto';



export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true, })
  @Type(() => CreatePostDto)  // Apply transformation for nested array
  posts?: CreatePostDto[];
}
