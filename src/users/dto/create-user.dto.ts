import { IsString, IsEmail, IsArray, ValidateNested, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { CreateGroupDto } from '../../groups/dto/createGroup.dto';



export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsNumber()
  age!: number;

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
  @Type(() => CreatePostDto) 
  posts?: CreatePostDto[];


  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true, })
  @Type(() => CreateGroupDto)  
  groups?: CreateGroupDto[];

}
