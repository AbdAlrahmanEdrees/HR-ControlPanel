import { PrismaClient } from '../generated/prisma/client';
import * as dotenv from 'dotenv';
// import {PrismaMariaDb} from '@prisma/adapter-mariadb'
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

async function main() {
    //###########################################################
    //#########################  MySQL  #########################
    //###########################################################
    // const adapter = new PrismaMariaDb({
    //     host:process.env.DB_HOST ,
    //     user:process.env.DB_USERNAME ,
    //     password:process.env.DB_PASSWORD ,
    //     database: process.env.DB_DATABASE,
    //     port:Number(process.env.DB_PORT),
    //     // connectionLimit:5
    // });
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
    const prisma = new PrismaClient({
        adapter: adapter
    });
    //  await prisma.$queryRaw`DROP TABLE IF EXISTS users;`
    const result = await prisma.users.findUnique({
        where: {
            email: "abdo.16288888@gmail.com"
        }
    });
    if (result != null)
        console.log(result);
    else console.log("HI")
}

main();
