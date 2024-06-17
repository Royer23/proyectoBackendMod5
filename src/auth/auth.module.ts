import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UsuarioRepository } from 'src/usuario/usuario.repository';
import { jwtConstants  } from 'src/constants/constant';
import { JwtStrategy } from './jwt.startegy';

@Module({
imports: [
  TypeOrmModule.forFeature([Usuario]), 
  UsuarioModule, 
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions:  { expiresIn: '60s'}
  })],
  providers: [AuthService, UsuarioService,UsuarioRepository, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
