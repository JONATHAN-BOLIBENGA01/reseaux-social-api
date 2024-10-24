import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Global() // c'est pour utiliser ce module de puis l'exterieur
@Module({
  providers: [MailerService],
  exports : [MailerService]
})
export class MailerModule {}
