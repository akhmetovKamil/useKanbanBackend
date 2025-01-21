import { Module } from "@nestjs/common";
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypegooseModule } from "nestjs-typegoose";
import { BoardsSchema } from "./boards.schema";
import { ProjectsModule } from "../projects/projects.module";

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: BoardsSchema,
        schemaOptions: {
          collection: "Boards",
        },
      },
    ]),
    ProjectsModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService]
})
export class BoardsModule {}
