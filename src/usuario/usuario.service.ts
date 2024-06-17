import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository){}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(
      createUsuarioDto.email
    )
    if(usuarioExistente){
      throw new ConflictException('Usuario Existente');
    }
    return this.usuarioRepository.crear(createUsuarioDto);
  }

  async validarUsuario(email: string, password: string): Promise<Usuario>{
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
    if(!usuarioExistente || usuarioExistente.password != password || usuarioExistente.email!= email) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }
    return usuarioExistente;
  }

  findOne(id: number) {
    return this.usuarioRepository.buscarPorId(id);
  }
  
  findAll() {
    return this.usuarioRepository.listar();
  }

  actualizar(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = this.usuarioRepository.buscarPorId(id);
    if(!usuario){
      throw new Error("usuario con id ${id} no se ha encontrado")
    }
    return this.usuarioRepository.actualizar(id, updateUsuarioDto);
  }

  eliminar(id: number) {
    return this.usuarioRepository.eliminar(id);
  }
}
