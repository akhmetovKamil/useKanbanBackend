import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProjectNameDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
