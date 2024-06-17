import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Usuario } from '../usuario/entities/usuario.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const usuario: Usuario = {
        id: 1,
        nombre: 'Miguel',
        email: 'miguel@gmail.com',
        nombreUsuario: 'miguel23',
        password: 'miguelito123'
      };

      const token = 'token';
      const payload = { nombreUsuario: usuario.nombreUsuario, sub: usuario.id };
      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.login(usuario);

      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ acces_token: token });
    });
  });
});
