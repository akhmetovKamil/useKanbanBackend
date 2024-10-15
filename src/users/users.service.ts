import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UsersSchema } from "./users.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { UsersCreateDto } from "./dto/users.create.dto";
import { Types } from "mongoose";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersSchema)
        private readonly usersSchema: ReturnModelType<typeof UsersSchema>,
    ) {}

    async createUser(email: string, dto: UsersCreateDto) {
        return await new this.usersSchema({
            email: email,
            name: dto.name,
            surname: dto.surname,
            patronymic: dto.patronymic,
            hash: dto.hash,
        }).save();
    }

    async getUser(email: string) {
        return this.usersSchema.findOne({ email });
    }

    async getUserId(email: string): Promise<Types.ObjectId> {
        const user = await this.usersSchema.findOne({ email }).exec();
        return user ? user._id : null;
    }

    async getProjectsPopulated(email: string) {
        return this.usersSchema
            .findOne({ email })
            .populate("projects")
            .execPopulate();
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
}
