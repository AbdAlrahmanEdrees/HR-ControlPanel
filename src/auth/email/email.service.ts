import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) {}
    
    private emailTransport(){
        
        const transporter=nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth:{
                user:this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            }
        });
        return transporter;
    }

    async sendVerificationCode(email:string, code:number){
        const transporter=this.emailTransport();
        const mailOptions={
            from: this.configService.get<string>('EMAIL_USER'),
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code} \n This code will expire in 10 minutes.`,
        };
        try{
            await transporter.sendMail(mailOptions);
        }catch(err){
            console.log('################################\nError sending email:', err);
        }

    }
}
