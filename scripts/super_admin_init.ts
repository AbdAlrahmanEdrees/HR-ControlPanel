import { ApprState, PrismaClient, UserRole } from '../generated/prisma/client';
import * as dotenv from 'dotenv';
// import {PrismaMariaDb} from '@prisma/adapter-mariadb'
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function seedDb() {
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
    //#########################  Postgresql  ####################
    //###########################################################
    const adapter = new PrismaPg({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: Number(process.env.DB_PORT),
        // ssl: {
        //     rejectUnauthorized: false,
        // },

        // connectionLimit:5
    });
    const prisma = new PrismaClient({
        adapter: adapter
    });
    const hashedPass = await bcrypt.hash('123456', 10);
    await prisma.users.create({
        data: {
            email: 'abdo.1628888@gmail.com',
            hashedPassword: hashedPass,
            name: "Abd",
            phone: "0982381873",
            approvalState: ApprState.VERIFIED,
            role: UserRole.SUPER_ADMIN

        }
    });
}



seedDb();
