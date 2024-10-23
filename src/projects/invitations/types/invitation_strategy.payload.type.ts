import { UserRole } from "../../../common/types/roles.types";

export type payloadType = { email: string; role: UserRole; position?: string };
