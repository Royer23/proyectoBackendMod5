import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import * as request from 'supertest';
import { ConflictException, INestApplication } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { CredencialesDTO } from './dto/credenciales.dto';

describe('UsuarioController', () => {
  let app: INestApplication;
  let usuarioService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn(),
    validarUsuario: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: usuarioService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Bypass JwtAuthGuard
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST usuarios', async () => {
    const createUsuarioDto: CreateUsuarioDto = {
        id: 1,
        nombre: 'Miguel',
        email: 'miguel@gmail.com',
        nombreUsuario: 'miguel23',
        password: 'miguelito123'
    }
    usuarioService.create.mockResolvedValue(createUsuarioDto);

    return request(app.getHttpServer())
      .post('/usuarios')
      .send(createUsuarioDto)
      .expect(201)
      .expect(createUsuarioDto);
  });

  it('/GET usuarios/:id', async () => {
    const usuario: Usuario = {
        id: 1,
        nombre: 'Miguel',
        email: 'miguel@gmail.com',
        nombreUsuario: 'miguel23',
        password: 'miguelito123'
    };
    usuarioService.findOne.mockResolvedValue(usuario);

    return request(app.getHttpServer())
      .get('/usuarios/1')
      .expect(200)
      .expect(usuario);
  });

  it('/GET usuarios', async () => {
    const nuevosUsuarios: Usuario[] = [
        { id: 1, nombre: 'Daniel', email: 'Daniel23@gmail.com', nombreUsuario: 'Daniel23', password: '123456s' },
        { id: 2, nombre: 'Saul', email: 'Saul3@gmail.com', nombreUsuario: 'Saul3', password: 'qwertyt' },
      ];
    usuarioService.findAll.mockResolvedValue(nuevosUsuarios);

    return request(app.getHttpServer())
      .get('/usuarios')
      .expect(200)
      .expect(nuevosUsuarios);
  });

  it('/PATCH usuarios/:id', async () => {
    const updateUsuarioDto: UpdateUsuarioDto = {nombre: 'Saul', email: 'Saul3@gmail.com', nombreUsuario: 'Saul3', password: 'qwertyt'};
    usuarioService.actualizar.mockResolvedValue({ affected: 1 });

    return request(app.getHttpServer())
      .patch('/usuarios/1')
      .send(updateUsuarioDto)
      .expect(200)
      .expect({ affected: 1 });
  });

  it('/DELETE usuarios/:id', async () => {
    usuarioService.eliminar.mockResolvedValue({ affected: 1 });

    return request(app.getHttpServer())
      .delete('/usuarios/1')
      .expect(200)
      .expect({ affected: 1 });
  });

  it('/POST usuarios (Error en Usuario ya Registrado)', async () => {
    const createUsuarioDto: CreateUsuarioDto = {
        id: 1,
        nombre: 'Miguel',
        email: 'miguel@gmail.com',
        nombreUsuario: 'miguel23',
        password: 'miguelito123'
    };
    usuarioService.create.mockImplementation(() => {
      throw new ConflictException('Usuario Existente');
    });

    return request(app.getHttpServer())
      .post('/usuarios')
      .send(createUsuarioDto)
      .expect(409)
      .expect({
        statusCode: 409,
        message: 'Usuario Existente',
        error: 'Conflict',
      });
  });

});