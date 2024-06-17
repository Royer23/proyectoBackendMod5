import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioRepository } from './usuario.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsuarioRepository', () => {
  let repository: UsuarioRepository;
  let usuarioRepository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioRepository,
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<UsuarioRepository>(UsuarioRepository);
    usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('Deberia crear un usuario', async () => {
    const createDto: CreateUsuarioDto = {
        id: 5,
        nombre: 'Miguel',
        email: 'miguel@gmail.com',
        nombreUsuario: 'miguel23',
        password: 'miguelito123'
    }

    const nuevoUsuario: Usuario = {
        id: 5,
        nombre: 'Miguel',
        email: 'miguel@gmail.com',
        nombreUsuario: 'miguel23',
        password: 'miguelito123'
    }

    jest.spyOn(usuarioRepository, 'save').mockResolvedValue(nuevoUsuario);

    const resultado = repository.crear(createDto);

    expect(resultado).toBeDefined();
    expect(usuarioRepository.save).toHaveBeenCalledWith(createDto);
    expect((await resultado).id).toBe(5);
    expect((await resultado).nombre).toBe(createDto.nombre);
    expect((await resultado).email).toBe(createDto.email);
    expect((await resultado).nombreUsuario).toBe(createDto.nombreUsuario);
    expect((await resultado).password).toBe(createDto.password);
  });

  it('deberia buscar un usuario por id', async () => {
    const usuarioNuevo: Usuario = {
        id: 5,
        nombre: 'Miguel',
        email: 'miguel@gmail.com',
        nombreUsuario: 'miguel23',
        password: 'miguelito123'
    }
    jest.spyOn(usuarioRepository, 'findOneBy').mockResolvedValue(usuarioNuevo);

    const resultado = await repository.buscarPorId(5);

    expect(resultado).toEqual(usuarioNuevo);
    expect(usuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 5 });
  });

  it('deberia buscar un usuario por email', async () => {
    const usuarioNuevo: Usuario = {
        id: 5,
        nombre: 'Miguel',
        email: 'miguel@gmail.com',
        nombreUsuario: 'miguel23',
        password: 'miguelito123'
    }
    jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuarioNuevo);

    const resultado = await repository.buscarPorEmail('miguel@gmail.com');

    expect(resultado).toEqual(usuarioNuevo);
    expect(usuarioRepository.findOne).toHaveBeenCalledWith({where:{ email: 'miguel@gmail.com' }});
  });

  it('deberia listar usuarios', async () => {
    const nuevosUsuarios: Usuario[] = [
      { id: 1, nombre: 'Daniel', email: 'Daniel23@gmail.com', nombreUsuario: 'Daniel23', password: '123456s' },
      { id: 2, nombre: 'Saul', email: 'Saul3@gmail.com', nombreUsuario: 'Saul3', password: 'qwertyt' },
    ];

    jest.spyOn(usuarioRepository, 'find').mockResolvedValue(nuevosUsuarios);

    const resultado = await repository.listar();

    expect(resultado).toEqual(nuevosUsuarios);
    expect(usuarioRepository.find).toHaveBeenCalled();
  });

  it('deberia actualizar usuario', async () => {
    const updateDto: UpdateUsuarioDto = {nombre: 'Saul', email: 'Saul3@gmail.com', nombreUsuario: 'Saul3', password: 'qwertyt'};
    const updateResultado = { affected: 1, raw: {} , generatedMaps: []};

    jest.spyOn(usuarioRepository, 'update').mockResolvedValue(updateResultado);

    const resultado = await repository.actualizar(1, updateDto);

    expect(resultado).toEqual(updateResultado);
    expect(usuarioRepository.update).toHaveBeenCalledWith(1, updateDto);
    expect(resultado.affected).toBe(1);
  });

  it('debria eliminar un usuario', async () => {
    
    jest.spyOn(usuarioRepository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

    const result = await usuarioRepository.delete(1);

    expect(result).toEqual({ affected: 1, raw: {} });
    expect(usuarioRepository.delete).toHaveBeenCalledWith(1);
  });


});
