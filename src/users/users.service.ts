import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UsersSchema } from "./users.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { CreateUserDto } from "./dto/create.user.dto";
import { Types } from "mongoose";
import { Errors } from "../common/exception.constants";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersSchema)
        private readonly usersSchema: ReturnModelType<typeof UsersSchema>,
    ) {}

    async createUser(email: string, dto: CreateUserDto): Promise<UsersSchema> {
        return await new this.usersSchema({
            email: email,
            name: dto.name,
            surname: dto.surname,
            patronymic: dto.patronymic,
            hash: dto.hash,
        }).save();
    }

    async getUser(email: string): Promise<UsersSchema> {
        const user = this.usersSchema.findOne({ email });
        if (!user) throw new NotFoundException(Errors.USER_NOT_FOUND);
        return user;
    }

    async getUserId(email: string): Promise<Types.ObjectId> {
        const user = await this.usersSchema.findOne({ email }).exec();
        return user ? user._id : null;
    }

    async getProjectsPopulated(email: string): Promise<UsersSchema> {
        return this.usersSchema.findOne({ email }).populate("projects").exec();
    }

    async updateRtHash(email: string, hash: string): Promise<void> {
        await this.usersSchema.findOneAndUpdate({ email }, { rtHash: hash });
    }

    async addProject(email: string, projectId: Types.ObjectId): Promise<void> {
        await this.usersSchema.findOneAndUpdate(
            { email },
            { $addToSet: { projects: projectId } },
        );
    }

    async deleteProjectFromUsers(projectId: Types.ObjectId): Promise<void> {
        await this.usersSchema.updateMany(
            { projects: projectId },
            { $pull: { projects: projectId } },
        );
    }
}
