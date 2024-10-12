import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { bcrypt } from "bcrypt";
import { AuthSignupDto } from "./dto/auth.signup.dto";
import { JwtTokens } from "./jwt.tokens.type";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async signup(dto: AuthSignupDto): Promise<JwtTokens> {
        const hash = await this.hash(dto.password);
        await this.userService.createUser(dto.email, {
            ...dto,
            hash,
        });
        return await this.generateTokens(dto.email);
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
                this.configService.get("AT_TIME"),
                this.configService.get("AT_SECRET"),
            ),
            this.generateToken(
                email,
                this.configService.get("RT_TIME"),
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
