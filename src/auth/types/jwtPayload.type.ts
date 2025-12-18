
// Define the shape of the payload encoded in your Access Token
export type JwtPayload = {
    // If you are curious:
    // You can make it whatever you want, you can customize it
    // It is not static, it is customizable.
    sub: string; // The user ID
    email: string;
    role:string; // ADMIN / SUPER_ADMIN
};