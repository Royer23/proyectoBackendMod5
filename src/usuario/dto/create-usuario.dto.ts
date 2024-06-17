import { IsAlphanumeric, IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator"
export class CreateUsuarioDto {

    @IsNumber()
    @IsNotEmpty()
    id:number;

    @IsString()
    @IsNotEmpty()
    @MinLength(5, {
        message: 'El nombre del usuario deberia tener al menos 5 caracteres'
    })
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, {
        message: 'El nickname del usuario deberia tener al menos 3 caracteres'
    })
    @IsAlphanumeric(null,{message: 'Solo se permiten números y letras'})
    nombreUsuario: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail(null,{message: 'Ingrese un email valido'})
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}
