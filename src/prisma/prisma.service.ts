import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {PrismaClient} from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient {
    constructor(ConfigService : ConfigService) /*c'est au niveau du constructor qu'on fais l'injection */{
        super({
            datasources: {
                db: {
                    url : ConfigService.get("DATABASE_URL") // DATABASE_URL c'est la variable qu'on utilise de puis le fichier.env

                }
            }
        })
    }
}
