import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { genSalt, hash, compare } from "bcryptjs";
import { AuthSignupDto } from "./dto/auth.signup.dto";
import { JwtTokens, signType } from "./types/jwt.tokens.type";
import { AuthSigninDto } from "./dto/auth.signin.dto";
import { Errors } from "../common/exception.constants";
import { createHash } from "crypto";
import { Types } from "mongoose";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async signup({ password, ...dto }: AuthSignupDto): Promise<signType> {
        if (await this.userService.getUser(dto.email))
            throw new BadRequestException(Errors.ALREADY_REGISTERED);
        const hash = await this.simpleHash(password);
        const user = await this.userService.createUser(dto.email, {
            ...dto,
            hash,
        });
        return {jwt: await this.getTokens(dto.email,user._id),user};
    }

    async signin(dto: AuthSigninDto): Promise<signType> {
        const user = await this.userService.getUser(dto.email);
        if (!user) throw new BadRequestException(Errors.USER_NOT_FOUND);
        const isPasswordValid = await compare(dto.password, user.hash);
        if (!isPasswordValid)
            throw new BadRequestException(Errors.USER_NOT_FOUND);
        return {jwt: await this.getTokens(dto.email,user._id),user};
    }

    async logout(email: string): Promise<void> {
        await this.userService.updateRtHash(email, null);
        console.log(`Logout: rtHash for ${email} set to null`);
    }

    async refresh(email: string, rt: string): Promise<JwtTokens> {
        const user = await this.userService.getUser(email);
        if (!user) throw new BadRequestException(Errors.USER_NOT_FOUND);
        if (!user.rtHash)
            throw new UnauthorizedException(Errors.RT_HASH_NOT_FOUND);
        console.log(`Stored rtHash: ${user.rtHash}`);
        console.log(`Provided rt: ${rt}`);
        const rtMatches = await this.compareTokens(rt, user.rtHash);
        console.log(`rtMatches: ${rtMatches}`);
        if (!rtMatches) throw new UnauthorizedException(Errors.RT_HASH_INVALID);
        return await this.getTokens(email, user._id);
    }

    async simpleHash(data: string): Promise<string> {
        const salt = await genSalt(10);
        return await hash(data, salt);
    }

    async hashToken(token: string): Promise<string> {
        const sha256Hash = createHash("sha256").update(token).digest("hex");
        const salt = await genSalt(10);
        return await hash(sha256Hash, salt);
    }

    async compareTokens(token: string, hashedToken: string): Promise<boolean> {
        const sha256Hash = createHash("sha256").update(token).digest("hex");
        return await compare(sha256Hash, hashedToken);
    }

    async getTokens(email: string, id: Types.ObjectId): Promise<JwtTokens> {
        const tokens = await this.generateTokens(email, id);
        const rtHash = await this.hashToken(tokens.refresh_token);
        await this.userService.updateRtHash(email, rtHash);
        return tokens;
    }

    async generateTokens(email: string, id: Types.ObjectId): Promise<JwtTokens> {
        const [at, rt] = await Promise.all([
            this.generateToken(
                email, id,
                15 * 60,
                this.configService.get("AT_SECRET"),
            ),
            this.generateToken(
                email, id,
                60 * 60 * 24 * 7,
                this.configService.get("RT_SECRET"),
            ),
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async generateToken(
        email: string,
        id: Types.ObjectId,
        expiresIn: number,
        secret: string,
    ): Promise<string> {
        return await this.jwtService.signAsync(
            { email, id },
            { expiresIn, secret },
        );
    }
}
