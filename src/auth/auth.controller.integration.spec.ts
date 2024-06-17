import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthService } from './auth.service';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { CredencialesDTO } from '../usuario/dto/credenciales.dto';
import { Usuario } from '../usuario/entities/usuario.entity';

describe('AuthController', () => {
  let app: INestApplication;
  let usuarioService = {
    validarUsuario: jest.fn(),
  };
  let authService = {
    login: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsuarioService,
          useValue: usuarioService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST auth/login (successful login)', async () => {
    const loginDto: CredencialesDTO = { email: 'miguel@gmail.com', password: 'miguelito123' };
    const usuario: Usuario = {
      id: 1,
      nombre: 'Miguel',
      email: 'miguel@gmail.com',
      nombreUsuario: 'miguel23',
      password: 'miguelito123'
    };
    const loginResponse = { accessToken: 'token' };

    usuarioService.validarUsuario.mockResolvedValue(usuario);
    authService.login.mockResolvedValue(loginResponse);

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201)
      .expect(loginResponse);
  });

  it('/POST auth/login (invalid credentials)', async () => {
    const loginDto: CredencialesDTO = { email: 'invalid@gmail.com', password: 'wrongpassword' };

    usuarioService.validarUsuario.mockImplementation(() => {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Correo o contraseña incorrectos',
        error: 'Unauthorized',
      });
  });
});
