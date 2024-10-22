import { Module } from "@nestjs/common";
import { InvitationsService } from "./invitations.service";
import { InvitationsController } from "./invitations.controller";
import { ProjectsService } from "../projects.service";

@Module({
    imports: [ProjectsService],
    providers: [InvitationsService],
    controllers: [InvitationsController],
})
export class InvitationsModule {}
