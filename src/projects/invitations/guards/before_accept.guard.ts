import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";

@Injectable()
export class BeforeAcceptGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const accessToken =
            request.headers["authorization"]?.split(" ")[1] ||
            request.query.accessToken;

        if (!accessToken) {
            context
                .switchToHttp()
                .getResponse()
                .redirect(this.configService.get("URL_SIGNUP"));
            return false;
        }

        return true;
    }
}
