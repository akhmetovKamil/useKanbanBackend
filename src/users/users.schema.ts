import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

export class UsersSchema extends TimeStamps {
    @prop({ unique: true, required: true })
    email: string;

    @prop({ required: true })
    name: string;

    @prop({ required: true })
    surname: string;

    @prop()
    patronymic?: string;

    @prop({ default: [], required: true })
    projects: string[];

    @prop({ default: 5, required: true })
    currentMood: number;

    @prop({ required: true })
    hash: string;
}
