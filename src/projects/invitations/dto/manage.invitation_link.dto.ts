import { IsNotEmpty, IsString } from "class-validator";

export class ManageInvitationLinkDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
