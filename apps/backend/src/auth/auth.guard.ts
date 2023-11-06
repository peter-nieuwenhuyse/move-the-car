import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {jwtConstants} from "./constatns";
import {Request} from 'express'
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../metaDataDecorators";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    if(this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getClass(), context.getHandler()])) {
      return true
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token) {
      throw new UnauthorizedException()
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret})
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request) : string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
