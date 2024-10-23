import { UsersSchema } from "../../users/users.schema";

export type JwtTokens = {
    access_token: string;
    refresh_token: string;
};

export type signType = {
    jwt: JwtTokens;
    user: UsersSchema;
}