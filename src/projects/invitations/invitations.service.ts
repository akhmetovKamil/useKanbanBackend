import { Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { ProjectsService } from "../projects.service";
import * as crypto from "crypto";
import { UserRole } from "../../common/types/roles.types";
import { AcceptInvitationLinkDto } from "./dto/accept.invitation_link.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";
import { MailerService } from "@nestjs-modules/mailer";
import { Errors } from "../../common/exception.constants";
import { ManageInvitationLinkDto } from "./dto/manage.invitation_link.dto";
import { ManageInvitationEmailDto } from "./dto/manage.invitation_email.dto";

@Injectable()
export class InvitationsService {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) {}

    async generateInvitationToken(
        id: Types.ObjectId,
        dto: ManageInvitationLinkDto,
    ): Promise<string> {
        const token = crypto.randomBytes(32).toString("hex");
        const hash = this.hashToken(token);
        await this.projectsService.setInvitationHash(id, dto.name, hash);
        // TODO is there are invitation accept page or accept only on backend route
        return `https:/.../invite/${token}`;
    }

    async deleteInvitationToken(
        id: Types.ObjectId,
        dto: ManageInvitationLinkDto,
    ) {
        await this.projectsService.deleteInvitationHash(id, dto.name);
    }

    async acceptLink(projectId: Types.ObjectId, dto: AcceptInvitationLinkDto) {
        const hashedToken = this.hashToken(dto.token);
        const project = await this.projectsService.getProject(projectId);
        const isValid = project.invitationHashes.has(hashedToken);
        if (!isValid) throw new NotFoundException(Errors.LINK_INCORRECT);
        await this.projectsService.changeUserData(projectId, {
            position: "viewer",
            role: UserRole.VIEWER,
            userId: dto.id,
        });
        // TODO add redirect to the project page in controller
        return "Success";
    }

    async sendInvitationEmail(
        projectId: Types.ObjectId,
        dto: ManageInvitationEmailDto,
    ) {
        const token = await this.generateEmailToken(
            dto.email,
            dto.role,
            dto.position,
        );
        const userId = await this.usersService.getUserId(dto.email);
        await this.projectsService.changeUserData(projectId, {
            position: dto.position,
            userId,
            role: UserRole.INVITED,
        });
        // TODO is there are invitation accept page or accept only on backend route
        const url = `https://.../accept-invite-email?token=${token}`;
        const name = await this.projectsService.getProjectName(projectId);
        await this.mailerService.sendMail({
            to: dto.email,
            subject: "Приглашение в проект",
            template: "invite",
            context: { url, projectName: name, role: dto.role },
        });
        // TODO отправляется 3000мс, надо чтобы не блокировались остальные функции на фронте
    }

    async acceptInvitation(
        projectId: Types.ObjectId,
        dto: ManageInvitationEmailDto,
    ) {
        const userId = await this.usersService.getUserId(dto.email);
        await this.projectsService.changeUserData(projectId, {
            position: dto.position,
            userId,
            role: dto.role,
        });
        // TODO Redirect to project page
    }

    async generateEmailToken(email: string, role: UserRole, position?: string) {
        return await this.jwtService.signAsync(
            { email, role, position },
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
