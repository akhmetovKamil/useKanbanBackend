import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "../../common/types/roles.types";
import { Types } from "mongoose";

export class TeamChangeDto {
    @IsString()
    @IsNotEmpty()
    position: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsMongoId()
    userId: Types.ObjectId;
}
