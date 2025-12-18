import { Controller, Get } from "@nestjs/common";
import { MyPublic } from "./common/decorators/public.decorator";

@Controller()
export class AppController{
    @MyPublic()
    @Get("")
    sayHi(){
        return "HI";
    }   
}