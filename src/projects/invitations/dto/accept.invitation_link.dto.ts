import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class AcceptInvitationLinkDto {
    @IsMongoId()
    id: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    token: string;
}
