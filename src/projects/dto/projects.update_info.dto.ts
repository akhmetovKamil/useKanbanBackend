import { IsNotEmpty, IsString } from "class-validator";

export class ProjectsUpdateInfoDto {
    @IsString()
    @IsNotEmpty()
    company: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
