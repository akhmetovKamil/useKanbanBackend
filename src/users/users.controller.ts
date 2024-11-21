import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { GetCurrentEmail } from "../common/decorators/get_current_email.decorator";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getHello(@GetCurrentEmail() email: string) {
        return this.usersService.getUser(email);
    }
}
