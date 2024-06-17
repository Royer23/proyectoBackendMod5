import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service'; // Ajusta la ruta según tu estructura de proyecto
import { CredencialesDTO } from 'src/usuario/dto/credenciales.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let usuarioService: UsuarioService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            validarUsuario: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    usuarioService = moduleRef.get<UsuarioService>(UsuarioService);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('Deberia retornar un token cuando las credenciales son validas', async () => {
    const loginDto: CredencialesDTO = { email: 'miguel@gmail.com', password: 'miguelito123' };
    const usuario: Usuario = {
      id: 1,
      nombre: 'Miguel',
      email: 'miguel@gmail.com',
      nombreUsuario: 'miguel23',
      password: 'miguelito123',
    };
    const tokenResponse = { acces_token: 'some-jwt-token' };

    jest.spyOn(usuarioService, 'validarUsuario').mockResolvedValue(usuario);
    jest.spyOn(authService, 'login').mockResolvedValue(tokenResponse);

    const result = await authController.login(loginDto);

    expect(usuarioService.validarUsuario).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    expect(authService.login).toHaveBeenCalledWith(usuario);
    expect(result).toEqual(tokenResponse);
  });

  it('Deberia enviar un mensaje de Excepcion cuando las credenciales son invalidas', async () => {
    const loginDto: CredencialesDTO = { email: 'invalid@gmail.com', password: 'wrongpassword' };

    jest.spyOn(usuarioService, 'validarUsuario').mockRejectedValue(new UnauthorizedException('Correo o contraseña incorrectos'));

    await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    expect(usuarioService.validarUsuario).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    expect(authService.login).not.toHaveBeenCalled();
  });
});
