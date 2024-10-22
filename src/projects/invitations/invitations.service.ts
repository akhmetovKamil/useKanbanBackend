import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ProjectsService } from "../projects.service";
import * as crypto from "crypto";
import { UserRole } from "../../common/types/roles.types";
import { AcceptInvitationLinkDto } from "./dto/accept.invitation_link.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class InvitationsService {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

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

    // TODO extract dto
    async deleteInvitationToken(id: Types.ObjectId, name: string) {
        await this.projectsService.deleteInvitationHash(id, name);
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

    async sendInvitationEmail(
        projectId: Types.ObjectId,
        email: string,
        role: string,
    ) {
        const token = await this.generateEmailToken(email, role);
        const id = await this.usersService.getUserId(email);
        await this.projectsService.changeUserData(projectId, {
            position: "random", // TODO implement default position
            userId: id,
            role: UserRole.INVITED,
        });
        console.log(token);
        //TODO use email service to send message
    }

    async acceptInvitation() {
        // TODO set role to Roles.Needed
    }

    async generateEmailToken(email: string, role: string) {
        return await this.jwtService.signAsync(
            { email, role },
            {
                expiresIn: 30 * 60,
                secret: this.configService.get("INVITATION_SECRET"),
            },
        );
    }

    hashToken(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }
}
