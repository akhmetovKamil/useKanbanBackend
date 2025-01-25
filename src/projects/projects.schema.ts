import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { pre, prop, PropType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { UserRole } from "../common/types/roles.types";
import { BoardsSchema } from "../boards/boards.schema";

class Info {
    @prop({ required: true, type: () => String })
    company: string;

    @prop({ required: true, type: () => String })
    description: string;
}

class Team {
    @prop({ type: () => String, default: "default_position" })
    position: string;

    @prop({ required: true, enum: UserRole })
    role: UserRole;
}

@pre<ProjectsSchema>("save", function (next) {
    this.team.forEach((value, key) => {
        if (!value.position) {
            value.position = "default_position";
        }
    });
    next();
})
export class ProjectsSchema extends TimeStamps {
    @prop({ required: true, type: () => String })
    name: string;

    @prop({ required: true, type: () => Info, _id: false })
    info: Info;

    @prop({ required: true, type: () => Team, _id: false })
    team: Map<Types.ObjectId, Team>;

    @prop({ type: () => Types.ObjectId, ref: () => BoardsSchema })
    boards: BoardsSchema[];

    @prop({ type: () => String }, PropType.MAP)
    invitationHashes: Map<string, string>;
}
