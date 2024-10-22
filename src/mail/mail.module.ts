import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from "path";
import * as mailgunTransport from "nodemailer-mailgun-transport";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule, // Import ConfigModule
        MailerModule.forRootAsync({
            imports: [ConfigModule], // Import ConfigModule here as well
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: mailgunTransport({
                    auth: {
                        api_key: configService.get<string>("MAILGUN_API_KEY"),
                        domain: configService.get<string>("MAILGUN_DOMAIN"),
                    },
                }),
                template: {
                    dir: path.join(__dirname, "templates"),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    exports: [MailerModule],
})
export class MailModule {}
