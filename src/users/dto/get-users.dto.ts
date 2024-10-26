import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class GetUsersDto {

    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    search?: string;
}