import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {Public} from "../metaDataDecorators";
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService) {
  }

  @Public()
  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByUsername(username);
    const match = await bcrypt.compare(pass, user.password)
    if(!match) {
      throw new UnauthorizedException();
    }
    const payload = {sub: user.id, username: user.username}
    return {
      access_token: await this.jwtService.signAsync(payload)
    }

  }
}
