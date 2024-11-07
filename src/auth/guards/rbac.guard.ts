import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../../common/decorators/role.decorator";
import { UserRole } from "../../common/types/roles.types";
import { ProjectsService } from "../../projects/projects.service";
import { Types } from "mongoose";
import { Errors } from "../../common/exception.constants";

@Injectable()
export class RBACGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private projectsService: ProjectsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const projectId: Types.ObjectId = request.params.projectId;
        const id: Types.ObjectId = request.user.id;
        const userRole = await this.projectsService.getUserRoleByProjectId(
            id,
            projectId,
        );
        return requiredRoles.includes(userRole);
    }

    handleRequest(err, user) {
        if (err) throw new UnauthorizedException(Errors.NOT_AUTHORIZED);
        return user;
    }
}
