import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { payloadType } from "../types/invitation_strategy.payload.type";

@Injectable()
export class InvitationStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter("token"),
            secretOrKey: configService.get("INVITATION_SECRET"),
        });
    }

    validate(payload: payloadType) {
        return payload;
    }
}
