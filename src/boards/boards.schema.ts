import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";



class Column {
    @prop({ required: true, type: () => String, _id: false })
    tasks: Map<Types.ObjectId, string>;
}

export class BoardsSchema extends TimeStamps {
    @prop({ required: true, type: () => String })
    name: string;

    @prop({ required: true, type: () => Column, _id: false })
    backlog_column: Column;

    @prop({ required: true, type: () => Column, _id: false })
    progress_column: Column;

    @prop({ required: true, type: () => Column, _id: false })
    done_column: Column;

}