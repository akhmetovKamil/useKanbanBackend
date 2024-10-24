import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";
import { Errors } from "../exception.constants";

@Injectable()
export class ParseObjectIdPipe
    implements PipeTransform<string, Types.ObjectId>
{
    transform(value: string): Types.ObjectId {
        if (!Types.ObjectId.isValid(value)) {
            throw new BadRequestException(Errors.NOT_OBJECT_ID);
        }
        return new Types.ObjectId(value);
    }
}
