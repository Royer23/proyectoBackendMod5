import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "src/constants/constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }

    validate(payload: any) {
        return { idUsuario: payload.id, nombreUsuario: payload.nombreUsuario}
    }
}