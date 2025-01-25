import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { TasksSchema } from "./tasks/tasks.schema";


export class BoardsSchema extends TimeStamps {
    @prop({ required: true, type: () => String })
    name: string;

    @prop({ type: () => Types.ObjectId, ref: () => TasksSchema })
    backlog: TasksSchema[];

    @prop({ type: () => Types.ObjectId, ref: () => TasksSchema })
    progress: TasksSchema[];

    @prop({ type: () => Types.ObjectId, ref: () => TasksSchema })
    done: TasksSchema[];

}