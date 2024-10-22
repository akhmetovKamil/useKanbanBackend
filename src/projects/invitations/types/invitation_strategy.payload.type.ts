import { UserRole } from "../../../common/types/roles.types";

export type payloadType = { email: string; role: UserRole };
// TODO role is not string, is enum
