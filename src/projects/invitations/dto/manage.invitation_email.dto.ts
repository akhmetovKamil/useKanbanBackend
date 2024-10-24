import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { UserRole } from "../../../common/types/roles.types";

export class ManageInvitationEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsOptional()
    position: string;
}
