import { Controller, Param, Post } from "@nestjs/common";
import { Types } from "mongoose";
import { ParseObjectIdPipe } from "../../common/pipes/parse_object_id.pipe";
import { InvitationsService } from "./invitations.service";
import { UserRole } from "../../common/types/roles.types";

@Controller("invitations")
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) {}

    // @Post("invite/:projectId/:token")
    // async acceptInvitation(
    //     @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
    //     @Param("token") token: string,
    // ) {
    //     // Use projectId and token
    // }

    @Post("test/:projectId")
    async test(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
    ) {
        return this.invitationsService.sendInvitationEmail(
            projectId,
            "alicesun65@gmail.com",
            UserRole.ADMIN,
            "default position",
        );
    }
}
