import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { ProjectsSchema } from "../../projects/projects.schema";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidPositionConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectModel(ProjectsSchema)
        private readonly projectsModel: ReturnModelType<typeof ProjectsSchema>,
    ) {}

    async validate(position: string, args): Promise<boolean> {
        const projectId = args.object.projectId;
        const project = await this.projectsModel.findById(projectId);
        return project ? project.positions.includes(position) : false;
    }

    defaultMessage(): string {
        return "Неправильная должность";
    }
}

export function IsValidPosition(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidPositionConstraint,
        });
    };
}
