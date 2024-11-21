import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProjectInfoDto {
    @IsString()
    @IsNotEmpty()
    company: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
