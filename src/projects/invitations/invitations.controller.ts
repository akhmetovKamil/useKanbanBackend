import { Controller, Param, Post } from "@nestjs/common";
import { Types } from "mongoose";
import { ParseObjectIdPipe } from "../../common/pipes/parse_object_id.pipe";

@Controller("invitations")
export class InvitationsController {
    @Post("invite/:projectId/:token")
    async acceptInvitation(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Param("token") token: string,
    ) {
        // Use projectId and token
    }
}
