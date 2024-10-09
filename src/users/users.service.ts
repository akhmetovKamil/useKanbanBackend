import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UsersSchema } from "./users.schema";
import { ReturnModelType } from "@typegoose/typegoose";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersSchema)
        private readonly usersSchema: ReturnModelType<typeof UsersSchema>,
    ) {}
}
