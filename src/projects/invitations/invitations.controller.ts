import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Redirect,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { ParseObjectIdPipe } from "../../common/pipes/parse_object_id.pipe";
import { InvitationsService } from "./invitations.service";
import { InvitationStrategy } from "./strategies/invitation.strategy";
import { Public } from "../../common/decorators/public.decorator";
import { ConfigService } from "@nestjs/config";
import { ManageInvitationEmailDto } from "./dto/manage.invitation_email.dto";
import { ManageInvitationLinkDto } from "./dto/manage.invitation_link.dto";
import { GetCurrentEmail } from "../../common/decorators/get_current_email.decorator";
import { BeforeAcceptGuard } from "./guards/before_accept.guard";
import { InvitationsGuard } from "./guards/invitations.guard";

@Controller("invitations")
export class InvitationsController {
    constructor(
        private readonly invitationsService: InvitationsService,
        private readonly configService: ConfigService,
    ) {}

    @Post("link/:projectId")
    @HttpCode(HttpStatus.CREATED)
    async generateLinkToken(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Body() dto: ManageInvitationLinkDto,
    ): Promise<string> {
        return this.invitationsService.generateLinkToken(projectId, dto);
    }

    @Delete(":projectId/:linkName")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteLinkToken(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Param("linkName") linkName: string,
    ) {
        await this.invitationsService.deleteLinkToken(projectId, linkName);
    }

    @Redirect("https://google.com", 302)
    @Post("link_accept/:projectId")
    async acceptLinkToken(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Query("token") token: string,
        @GetCurrentEmail() email: string,
    ) {
        await this.invitationsService.acceptLink(projectId, { email, token });
        return { url: `${this.configService.get("URL_PROJECT")}/${projectId}` };
    }

    @Post("email/:projectId")
    async sendEmail(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Body() dto: ManageInvitationEmailDto,
        @Res() res,
    ) {
        res.send("success");
        await this.invitationsService.sendInvitationEmail(projectId, dto);
    }

    @Redirect("https://google.com", 302)
    @Public()
    @UseGuards(InvitationsGuard, BeforeAcceptGuard)
    @Post("email_accept/:projectId")
    async acceptEmail(
        @Param("projectId", ParseObjectIdPipe) projectId: Types.ObjectId,
        @Query("token") token: string,
        @Req() req,
    ) {
        const { email, role, position } = req.user;
        await this.invitationsService.acceptEmail(projectId, {
            email,
            role,
            position,
        });
        return { url: `${this.configService.get("URL_PROJECT")}/${projectId}` };
    }
}
