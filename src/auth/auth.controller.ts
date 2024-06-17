import { Body, Controller, Post } from '@nestjs/common';
import { CredencialesDTO } from '../usuario/dto/credenciales.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private usaurioService: UsuarioService,
        private authService: AuthService){}
    @Post('login')
    async login(@Body() credencialesDTO: CredencialesDTO){
        const usuario = await  this.usaurioService.validarUsuario(
            credencialesDTO.email,
            credencialesDTO.password,
        );
        return this.authService.login(usuario)
    }
}
