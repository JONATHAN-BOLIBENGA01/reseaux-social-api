import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';


@Global() // pour exporter le provider d'un service  à un autre module
@Module({
  providers: [PrismaService],
  exports: [PrismaService] // pour exporter le provider d'un service  à un autre module
})
export class PrismaModule {}
