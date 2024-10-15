import {
    ArrayNotEmpty,
    IsArray,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ProjectsCreateDto {
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

export class Info {
    @IsString()
    @IsNotEmpty()
    company: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
