import {
    ArrayNotEmpty,
    IsArray,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class Info {
    @IsString()
    @IsNotEmpty()
    company: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @ValidateNested()
    @Type(() => Info)
    info: Info;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    positions: string[];
}
