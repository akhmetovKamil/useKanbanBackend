import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ProjectsService } from "../projects.service";
import * as crypto from "crypto";
import { UserRole } from "../../common/types/roles.types";
import { AcceptInvitationLinkDto } from "./dto/accept.invitation_link.dto";

@Injectable()
export class InvitationsService {
    constructor(private readonly projectsService: ProjectsService) {}

    async generateInvitationToken(
        id: Types.ObjectId,
        name: string,
    ): Promise<string> {
        const token = crypto.randomBytes(32).toString("hex");
        const hash = this.hashToken(token);
        await this.projectsService.setInvitationHash(id, name, hash);
        // TODO is there are invitation accept page or accept only on backend route
        return `https:/.../invite/${token}`;
    }

    async deleteInvitationToken(id: Types.ObjectId, name: string) {
        await this.projectsService.deleteInvitationHash(id, name);
    }

    hashToken(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }

    async acceptLink(projectId: Types.ObjectId, dto: AcceptInvitationLinkDto) {
        const hashedToken = this.hashToken(dto.token);
        console.log(hashedToken);
        const project = await this.projectsService.getProject(projectId);
        const isValid = project.invitationHashes.has(hashedToken);
        if (!isValid) throw new Error("Invalid invitation link"); // TODO wrong error throwing
        await this.projectsService.changeUserData(projectId, {
            position: "viewer", // TODO implement default position
            role: UserRole.VIEWER,
            userId: dto.id,
        });
        // TODO add redirect to the project page in controller
        return "Success";
    }

    async acceptInvitation() {
        // TODO set role to Roles.Invited
    }

    async sendInvitationEmail() {
        // TODO set role to Roles.Invited
    }
}
