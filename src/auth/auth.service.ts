import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { bcrypt } from "bcrypt";
import { AuthSignupDto } from "./dto/auth.signup.dto";
import { JwtTokens } from "./types/jwt.tokens.type";
import { AuthSigninDto } from "./dto/auth.signin.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async signup({ password, ...dto }: AuthSignupDto): Promise<JwtTokens> {
        const hash = await this.hash(password);
        await this.userService.createUser(dto.email, {
            ...dto,
            hash,
        });
        return this.getTokens(dto.email);
    }

    async signin(dto: AuthSigninDto): Promise<JwtTokens> {
        const user = await this.userService.getUser(dto.email);
        if (!user) throw new Error("User not found");
        const isPasswordValid = await bcrypt.compare(dto.password, user.hash);
        if (!isPasswordValid) throw new Error("Invalid password");
        return this.getTokens(dto.email);
    }

    async getTokens(email: string): Promise<JwtTokens> {
        const tokens = await this.generateTokens(email);
        const rtHash = await this.hash(tokens.refresh_token);
        await this.userService.updateRtHash(email, rtHash);
        return tokens;
    }

    async generateToken(
        email: string,
        expiresIn: number,
        secret: string,
    ): Promise<string> {
        return await this.jwtService.signAsync(
            { email },
            { expiresIn, secret },
        );
    }

    async generateTokens(email: string): Promise<JwtTokens> {
        const [at, rt] = await Promise.all([
            this.generateToken(
                email,
                15 * 60,
                this.configService.get("AT_SECRET"),
            ),
            this.generateToken(
                email,
                60 * 60 * 24 * 7,
                this.configService.get("RT_SECRET"),
            ),
        ]);
        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async hash(data: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(data, salt);
    }
}
