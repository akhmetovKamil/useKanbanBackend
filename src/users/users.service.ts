import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UsersSchema } from "./users.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { UserCreateDto } from "./dto/user.create.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersSchema)
        private readonly usersSchema: ReturnModelType<typeof UsersSchema>,
    ) {}

    async createUser(email: string, dto: UserCreateDto) {
        return await new this.usersSchema({
            email: email,
            name: dto.name,
            surname: dto.surname,
            patronymic: dto.patronymic,
        }).save();
    }

    async getUser(email: string) {
        return this.usersSchema.findOne({ email: email });
    }
}
