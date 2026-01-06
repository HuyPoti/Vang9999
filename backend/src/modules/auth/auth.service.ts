import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async login(loginDto: LoginDto) {
        const adminUsername = this.configService.get('ADMIN_USERNAME');
        const adminPassword = this.configService.get('ADMIN_PASSWORD');

        if (
            loginDto.username === adminUsername &&
            loginDto.password === adminPassword
        ) {
            const payload = { username: adminUsername, sub: 'admin' };
            return {
                status: 'success',
                data: {
                    access_token: this.jwtService.sign(payload),
                    username: adminUsername,
                },
            };
        }

        throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }
}
