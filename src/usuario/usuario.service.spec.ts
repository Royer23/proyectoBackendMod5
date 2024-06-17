import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioRepository } from './usuario.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: UsuarioRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: UsuarioRepository,
          useValue: {
            buscarPorEmail: jest.fn(),
            crear: jest.fn(),
            buscarPorId: jest.fn(),
            listar: jest.fn(),
            actualizar: jest.fn(),
            eliminar: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<UsuarioRepository>(UsuarioRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Deberia crear un nuevo usuario', async () => {
    const createUsuarioDto: CreateUsuarioDto = {id: 1,nombre: 'test', email: 'test@example.com',nombreUsuario:'test1', password: 'password' };
    const usuario: Usuario = { id: 1, nombre: 'test1',email: 'test@example.com',nombreUsuario:'test1', password:'password'};
    
    jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(null);
    jest.spyOn(repository, 'crear').mockResolvedValue(usuario as any);

    const resultado = await service.create(createUsuarioDto);

    expect(resultado).toEqual(usuario);
    expect(repository.buscarPorEmail).toHaveBeenCalledWith(createUsuarioDto.email);
    expect(repository.crear).toHaveBeenCalledWith(createUsuarioDto);
  });

  it('Deberia enviar una Excepcion si el usuario existe', async () => {
    const createUsuarioDto: CreateUsuarioDto = {id: 1,nombre: 'test', email: 'test@example.com',nombreUsuario:'test1', password: 'password' };
    const usuario: Usuario = { id: 1, nombre: 'test1',email: 'test@example.com',nombreUsuario:'test1', password:'password'};
    
    jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(usuario as any);

    await expect(service.create(createUsuarioDto)).rejects.toThrow(ConflictException);
    expect(repository.buscarPorEmail).toHaveBeenCalledWith(createUsuarioDto.email);
  });

  it('Deberia validar el ingreso de un usuario con las credenciales correctas', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const usuario: Usuario = { id: 1, nombre: 'test1',email: 'test@example.com',nombreUsuario:'test1', password:'password'};
    
    jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(usuario as any);

    const resultado = await service.validarUsuario(email, password);

    expect(resultado).toEqual(usuario);
    expect(repository.buscarPorEmail).toHaveBeenCalledWith(email);
  });

  it('Deberia enviar una excepcion no autorizada por credenciales incorrectas', async () => {
    const email = 'test@example.com';
    const password = 'password';

    jest.spyOn(repository, 'buscarPorEmail').mockResolvedValue(null);

    await expect(service.validarUsuario(email, password)).rejects.toThrow(UnauthorizedException);
    expect(repository.buscarPorEmail).toHaveBeenCalledWith(email);
  });

  it('Deberia encontrar un usuario por su ID', async () => {
    const usuario: Usuario = { id: 1, nombre: 'test1',email: 'test@example.com',nombreUsuario:'test1', password:'password'};
    
    jest.spyOn(repository, 'buscarPorId').mockResolvedValue(usuario as any);

    const resultado = await service.findOne(1);

    expect(resultado).toEqual(usuario);
    expect(repository.buscarPorId).toHaveBeenCalledWith(1);
    
  });

  it('deberia listar a todos los usuarios', async () => {
    const usuarios: Usuario[] = [
      { id: 1, nombre: 'Daniel', email: 'Daniel23@gmail.com', nombreUsuario: 'Daniel23', password: '123456s' },
      { id: 2, nombre: 'Saul', email: 'Saul3@gmail.com', nombreUsuario: 'Saul3', password: 'qwertyt' },
    ];

    jest.spyOn(repository, 'listar').mockResolvedValue(usuarios as any);

    const resultado = await service.findAll();

    expect(resultado).toEqual(usuarios);
    expect(repository.listar).toHaveBeenCalled();
  });

  it('deberia actualizar un usuario', async () => {
    const updateUsuarioDto: UpdateUsuarioDto = {nombre: 'test1', email: 'updated@example.com',nombreUsuario:'test1', password:'password' };
    const usuario: Usuario = { id: 1, nombre: 'test1',email: 'test@example.com',nombreUsuario:'test1', password:'password'};
    jest.spyOn(repository, 'buscarPorId').mockResolvedValue(usuario as any);
    jest.spyOn(repository, 'actualizar').mockResolvedValue({ affected: 1 } as any);

    const resultado = await service.actualizar(1, updateUsuarioDto);

    expect(resultado).toEqual({ affected: 1 });
    expect(repository.buscarPorId).toHaveBeenCalledWith(1);
    expect(repository.actualizar).toHaveBeenCalledWith(1, updateUsuarioDto);
  });

  

  it('Deberia eliminar un usuario', async () => {
    const resultadoEliminado = { affected: 1 };

    jest.spyOn(repository, 'eliminar').mockResolvedValue(resultadoEliminado as any);

    const resultado = await service.eliminar(1);

    expect(resultado).toEqual(resultadoEliminado);
    expect(repository.eliminar).toHaveBeenCalledWith(1);
  });

});
