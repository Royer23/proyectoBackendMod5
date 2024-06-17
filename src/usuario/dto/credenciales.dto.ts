import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";

export class CredencialesDTO{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, {
        message: 'El password deberia tener al menos 6 caracteres'
    })
    password: string;
}