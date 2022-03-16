import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    createToken(id: string, admin: boolean, secret: string) {
        return jwt.sign({ id, admin }, secret, { expiresIn: '2h' });
    }

    validateToken(token: string, secret: string) {
        return jwt.verify(token, secret);
    }
}
