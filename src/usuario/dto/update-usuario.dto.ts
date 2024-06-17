import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @IsString()
    @IsOptional()
    @MinLength(5, {
        message: 'El nombre del usuario deberia tener al menos 5 caracteres'
    })
    nombre?: string;

    @IsString()
    @IsOptional()
    @MinLength(3, {
        message: 'El nickname del usuario deberia tener al menos 3 caracteres'
    })
    @IsAlphanumeric(null,{message: 'Solo se permiten números y letras'})
    nombreUsuario?: string;

    @IsString()
    @IsOptional()
    @IsEmail(null,{message: 'Ingrese un email valido'})
    email?: string;

    @IsString()
    @IsOptional()
    password: string;
}
