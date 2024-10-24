import { AuthGuard } from "@nestjs/passport";

export class InvitationsGuard extends AuthGuard("jwt-invitation") {
    constructor() {
        super();
    }
}
