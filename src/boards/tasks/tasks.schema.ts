import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose"
import { ColumnEnum } from "./tasks.type";


export class TasksSchema extends TimeStamps {
    @prop({ required: true, type: () => String })
    name: string;

    @prop({ required: true, Enum: ColumnEnum, default: ColumnEnum.BACKLOG })
    column: ColumnEnum;

    @prop({ type: () => String })
    description?: string;

}