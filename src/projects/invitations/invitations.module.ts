import { forwardRef, Module } from "@nestjs/common";
import { InvitationsService } from "./invitations.service";
import { InvitationsController } from "./invitations.controller";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { InvitationStrategy } from "./strategies/invitation.strategy";
import { UsersModule } from "../../users/users.module";
import { ProjectsModule } from "../projects.module";

@Module({
    imports: [
        forwardRef(() => ProjectsModule),
        ConfigModule,
        UsersModule,
        JwtModule.register({}),
    ],
    providers: [InvitationsService, InvitationStrategy],
    controllers: [InvitationsController],
})
export class InvitationsModule {}
