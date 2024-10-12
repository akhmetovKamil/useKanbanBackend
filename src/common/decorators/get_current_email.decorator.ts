import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrentEmail = createParamDecorator(
    (_, context: ExecutionContext) =>
        context.switchToHttp().getRequest().user["email"],
);
