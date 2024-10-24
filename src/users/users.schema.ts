import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop, Ref } from "@typegoose/typegoose";
import { ProjectsSchema } from "../projects/projects.schema";
import { Types } from "mongoose";

export class UsersSchema extends TimeStamps {
    @prop({ unique: true, required: true, type: () => String })
    email: string;

    @prop({ required: true, type: () => String })
    name: string;

    @prop({ required: true, type: () => String })
    surname: string;

    @prop({ type: () => String })
    patronymic?: string;

    // @prop({ type: () => [Types.ObjectId], default: [], required: true })
    @prop({ type: () => Types.ObjectId, ref: () => ProjectsSchema })
    projects: ProjectsSchema[];

    @prop({ default: 5, required: true })
    currentMood: number;

    @prop({ required: true, type: () => String })
    hash: string;

    @prop({ default: null, nullable: true })
    rtHash: string | null;
}
