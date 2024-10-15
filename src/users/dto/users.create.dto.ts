import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UsersCreateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    surname?: string;

    @IsString()
    @IsOptional()
    patronymic?: string;

    @IsString()
    @IsNotEmpty()
    hash: string;
}
