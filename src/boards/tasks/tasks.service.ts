import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { TasksSchema } from "./tasks.schema";

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(TasksSchema)
        private readonly tasksSchema: ReturnModelType<typeof TasksSchema>,
        private readonly tasksService: TasksService,
    ) {}


}
