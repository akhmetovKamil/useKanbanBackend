import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrentRt = createParamDecorator(
    (_, context: ExecutionContext) =>
        context.switchToHttp().getRequest().user["rt"],
);
