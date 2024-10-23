import { IsMongoId, IsNotEmpty } from "class-validator";

export class DeleteProjectUserDto {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}
