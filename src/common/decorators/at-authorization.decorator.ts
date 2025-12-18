import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";


export function AtAuthorizationHeader(){
    return applyDecorators(        
          ApiHeader({
            name: 'Authorization',
            example:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNGI1ZDJjMy0zZGE1LTRkNmUtOWE0ZS1mMDg4Yzc1NDMzZjIiLCJlbWFpbCI6ImFiZG8uMTYyODg4OEBnbWFpbC5jb20iLCJpYXQiOjE3NjQyMzQ4MTYsImV4cCI6MTc2NDIzNTcxNn0.nqlK50B41j_YRo7rxLn1hI-H3rlL_Ra3I8WvtQ7_Ngo ',
            description: "Should be like this: 'Bearer access_token'",
            required: false
          })
    )
}