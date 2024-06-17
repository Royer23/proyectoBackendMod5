import { Injectable } from '@nestjs/common';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService){}
    async login(usuario: Usuario){
        const payload = { nombreUsuario: usuario.nombreUsuario, sub:usuario.id};
        return {
            acces_token: this.jwtService.sign(payload),
        }
    }
}
