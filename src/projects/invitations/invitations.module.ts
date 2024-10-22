import { Module } from "@nestjs/common";
import { InvitationsService } from "./invitations.service";
import { InvitationsController } from "./invitations.controller";
import { ProjectsService } from "../projects.service";
import { ConfigModule } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Module({
    imports: [ProjectsService, ConfigModule, UsersService],
    providers: [InvitationsService],
    controllers: [InvitationsController],
})
export class InvitationsModule {}
