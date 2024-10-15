import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../../common/types/roles.types";
import { IsValidPosition } from "../../common/decorators/is_valid_position.decorator";

export class TeamChangeDto {
    @IsValidPosition({ message: "Invalid position" })
    position: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
