import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "../../common/types/roles.types";
import { Types } from "mongoose";

export class ChangeProjectTeamDto {
    @IsString()
    @IsNotEmpty()
    position: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsMongoId()
    userId: Types.ObjectId;
}
