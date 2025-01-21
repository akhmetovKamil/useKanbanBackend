import { forwardRef, Module } from "@nestjs/common";
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { TasksSchema } from "./tasks.schema";
import { BoardsModule } from "../boards.module";

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TasksSchema,
        schemaOptions: {
          collection: "Tasks",
        },
      },
    ]),
    forwardRef(() => BoardsModule),
  ],
  providers: [TasksService],
  controllers: [TasksController]
})
export class TasksModule {}
