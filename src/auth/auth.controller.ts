import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator";
import { JwtTokens } from "./types/jwt.tokens.type";
import { GetCurrentEmail } from "../common/decorators/get_current_email.decorator";
import { RtGuard } from "./guards/rt.guard";
import { GetCurrentRt } from "../common/decorators/get_current_rt.decorator";
import { AuthService } from "./auth.service";
import { AuthSigninDto } from "./dto/auth.signin.dto";
import { AuthSignupDto } from "./dto/auth.signup.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: AuthSignupDto): Promise<JwtTokens> {
        return await this.authService.signup(dto);
    }

    @Public()
    @Post("signin")
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: AuthSigninDto): Promise<JwtTokens> {
        return await this.authService.signin(dto);
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentEmail() email: string) {
        await this.authService.logout(email);
    }

    @Public()
    @UseGuards(RtGuard)
    @HttpCode(HttpStatus.OK)
    @Post("refresh")
    async refresh(
        @GetCurrentEmail() email: string,
        @GetCurrentRt() rt: string,
    ): Promise<JwtTokens> {
        return await this.authService.refresh(email, rt);
    }
}
