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

    @prop({ required: true })
    projects: string[];

    @prop({ required: true })
    currentMood: number;
}
