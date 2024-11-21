import { ConfigService } from "@nestjs/config";
import { TypegooseModuleOptions } from "nestjs-typegoose";

export const getMongoConfig = async (
    configService: ConfigService,
): Promise<TypegooseModuleOptions> => ({
    uri: getURI(configService),
});

const getURI = (configService: ConfigService): string => {
    return (
        `mongodb+srv://` +
        configService.get("MONGO_USER") +
        `:` +
        configService.get("MONGO_PASSWORD") +
        `@devcluster.1xbbj.mongodb.net/?retryWrites=true&w=majority&appName=devCluster`
    );
};
