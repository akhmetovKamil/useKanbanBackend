import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

export class UsersSchema extends TimeStamps {
    @prop({ unique: true, required: true, type: () => String })
    email: string;

    @prop({ required: true, type: () => String })
    name: string;

    @prop({ required: true, type: () => String })
    surname: string;

    @prop({ type: () => String })
    patronymic?: string;

    @prop({ default: [], required: true })
    projects: string[];

    @prop({ default: 5, required: true })
    currentMood: number;

    @prop({ required: true, type: () => String })
    hash: string;

    @prop({ default: null, nullable: true })
    rtHash: string | null;
}
