import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from '@nestjs/config' // POUR Utiliser le fichier .env
import { MailerModule } from './mailer/mailer.module';
import { PostModule } from './post/post.module';
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),AuthModule, PrismaModule, MailerModule, PostModule, CommentsModule],
})
export class AppModule {}
