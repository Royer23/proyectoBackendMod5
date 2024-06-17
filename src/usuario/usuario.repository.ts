import { Injectable } from "@nestjs/common";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { Usuario } from "./entities/usuario.entity";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
@Injectable()
export class UsuarioRepository{
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ){}

    crear(createUsuarioDto: CreateUsuarioDto){
        return this.usuarioRepository.save(createUsuarioDto);
    }
    buscarPorId(id: number){
        return this.usuarioRepository.findOneBy({ id });
    }
    async buscarPorEmail(email: string): Promise<Usuario>{
        return await this.usuarioRepository.findOne({ where: {email} });
    }
    
    listar(){
        return this.usuarioRepository.find();
    }

    actualizar(id: number , updateUsuarioDto: UpdateUsuarioDto){
        return this.usuarioRepository.update(id,updateUsuarioDto);
    }

    eliminar(id: number){
        return this.usuarioRepository.delete(id);
    }
}