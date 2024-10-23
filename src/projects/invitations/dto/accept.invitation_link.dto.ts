import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AcceptInvitationLinkDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}
