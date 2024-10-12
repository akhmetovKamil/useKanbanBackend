import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";

export class AuthSignupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(8)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(10)
    surname: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    patronymic?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(12)
    password: string;
}
