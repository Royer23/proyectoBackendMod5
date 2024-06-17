import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { UsuarioRepository } from './usuario.repository'; // Ajusta la ruta según tu estructura de proyecto
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let usuarioService: UsuarioService;

  const mockUsuarioService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Deberia crear un nuevo usuario', async () => {
    const createUsuarioDto: CreateUsuarioDto = {
      id: 1,
      nombre: 'Miguel',
      email: 'miguel@gmail.com',
      nombreUsuario: 'miguel23',
      password: 'miguelito123'
    }
    const usuario: Usuario = {
      id: 1,
      nombre: 'Miguel',
      email: 'miguel@gmail.com',
      nombreUsuario: 'miguel23',
      password: 'miguelito123'
    }
    mockUsuarioService.create.mockResolvedValue(usuario);

    const result = await controller.create(createUsuarioDto);

    expect(usuarioService.create).toHaveBeenCalledWith(createUsuarioDto);
    expect(result).toEqual(usuario);
  });

  it('Deberia encontrar un usuario por su ID', async () => {
    const usuario: Usuario = {
      id: 1,
      nombre: 'Miguel',
      email: 'miguel@gmail.com',
      nombreUsuario: 'miguel23',
      password: 'miguelito123'
    }
    mockUsuarioService.findOne.mockResolvedValue(usuario);

    const result = await controller.findOne(1);

    expect(usuarioService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(usuario);
  });

  it('Deberia listar a todos los usuarios', async () => {
    const usuarios: Usuario[] = [
      { id: 1, nombre: 'Daniel', email: 'Daniel23@gmail.com', nombreUsuario: 'Daniel23', password: '123456s' },
      { id: 2, nombre: 'Saul', email: 'Saul3@gmail.com', nombreUsuario: 'Saul3', password: 'qwertyt' },
    ];
    mockUsuarioService.findAll.mockResolvedValue(usuarios);

    const result = await controller.findAll();

    expect(usuarioService.findAll).toHaveBeenCalled();
    expect(result).toEqual(usuarios);
  });

  it('Deberia actualizar un usuario', async () => {
    const updateUsuarioDto: UpdateUsuarioDto = { id: 1, nombre: 'Saul', email: 'Saul3@gmail.com', nombreUsuario: 'Saul3', password: 'qwertyt' };
    const usuario: Usuario = { id: 1, email: 'updated@test.com', password: 'newpassword123', nombre: 'Updated', nombreUsuario: 'updateduser' };
    mockUsuarioService.actualizar.mockResolvedValue(usuario);

    const result = await controller.update(1, updateUsuarioDto);

    expect(usuarioService.actualizar).toHaveBeenCalledWith(1, updateUsuarioDto);
    expect(result).toEqual(usuario);
  });

  it('Deberia eliminar un usuario', async () => {
    const result = { affected: 1 };
    mockUsuarioService.eliminar.mockResolvedValue(result);

    const response = await controller.remove(1);

    expect(usuarioService.eliminar).toHaveBeenCalledWith(1);
    expect(response).toEqual(result);
  });
});
