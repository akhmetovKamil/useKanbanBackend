import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { UserRole } from "../common/types/roles.types";

export class ProjectsSchema extends TimeStamps {
    @prop({ required: true, type: () => String })
    name: string;

    @prop({ required: true, type: () => Info, _id: false })
    info: Info;

    @prop({ type: () => [String], default: [] })
    positions: string[];

    @prop({ required: true, type: () => UsersData, _id: false })
    usersData: Map<Types.ObjectId, UsersData>;
}

class Info {
    @prop({ required: true, type: () => String })
    company: string;

    @prop({ required: true, type: () => String })
    description: string;
}

class UsersData {
    @prop({ required: true, type: () => String })
    position: string;

    @prop({ required: true, enum: UserRole })
    role: UserRole;
}
