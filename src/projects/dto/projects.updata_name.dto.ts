import { IsNotEmpty, IsString } from "class-validator";

export class ProjectsUpdateNameDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
