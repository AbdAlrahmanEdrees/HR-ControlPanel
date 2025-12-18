import { UserRole } from "generated/prisma/enums";

const r:Record<string,number>={
    ['hi']:1,
    'hello':2
}

console.log('hii' in r);







// import * as fs from 'fs';
// import {Employees} from "../generated/prisma/client"
// import {AttritionRiskClass, BusinessTravelType, DepartmentType, EducationFieldType, EducationLevel, JobRoleType, MaritalStatusType, PerformanceRating, SatisfactionRating} from "../generated/prisma/enums"
//   // hourlyRate               Int
//   // dailyRate                Int
//   // monthlyRate              Int
//   // stockOptionLevel         Int
//   // promotionStagnationRatio Float
// const ex_columns=['daily_rate','hourly_rate','monthly_rate','stock_option_level','promotion_stagnation_ratio'];

// const file = fs.readFileSync('scripts\\Transformed_HR_Analytics_Dataset.csv', 'utf-8');

// const lines = file.split('\n');
// const headers = lines[0].split(',');

// const rows = lines.slice(1).map(line => {
//   const values = line.split(',');
//   return headers.reduce((obj, header, index) => {
//     obj[header.trim()] = values[index]?.trim();
//     return obj;
//   }, {} as Record<string, string>);
// });
// // for(const line in lines){
// //     for(const header in headers){
// //         if(!ex_columns.includes(header)){
            
// //         }
// //     }
// // }

// let i=0;
// for(const header of headers){

//     // if(!ex_columns.includes(header)){
//         console.log(i+" "+header+"\n");
//         i++;
//     // }
// }
