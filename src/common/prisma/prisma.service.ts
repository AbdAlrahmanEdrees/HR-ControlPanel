import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {  PrismaClient } from '../../../generated/prisma/client';
//################### For PostgreSQL #######################
import {PrismaPg} from '@prisma/adapter-pg'
//################### For MySQL #######################
// import {PrismaMariaDb} from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(){
        
//###########################################################
//#########################  MySQL  #########################
//###########################################################
        // In prisma 7, prisma removed t he old pattern of having
        // a url inside the schema.prisma file
        // you here, in the PrismaService you sould provide in the super
        // on of the two:
        // - an adapter
        // - or an accelerateUrl
        // super({accelerateUrl:"j"});
        // const adapter = new PrismaMariaDb({
        //     host:process.env.DB_HOST ,
        //     user:process.env.DB_USERNAME ,
        //     password:process.env.DB_PASSWORD ,
        //     database: process.env.DB_DATABASE,
        //     port:Number(process.env.DB_PORT),
        //     // connectionLimit:5
        // });
        // super({adapter:adapter});
        
    //###########################################################
    //###### Aiven Postgresql  (requires ssl encryption) ########
    //###########################################################
    const adapter = new PrismaPg({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: Number(process.env.DB_PORT),
        ssl: {
            rejectUnauthorized: false,
        },
        // connectionLimit:5
    });
    //###########################################################
    //################### Local  Postgresql  ####################
    //###########################################################
    // const adapter = new PrismaPg({
    //     host: process.env.DB_HOST,
    //     user: process.env.DB_USERNAME,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_DATABASE,
    //     port: Number(process.env.DB_PORT),
    //     // connectionLimit:5
    // });
        super({adapter:adapter});
    }

    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
