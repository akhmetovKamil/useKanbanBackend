import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";

export class SignupAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(2)
    @MaxLength(15)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(15)
    surname: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(15)
    patronymic?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(14)
    password: string;
}
