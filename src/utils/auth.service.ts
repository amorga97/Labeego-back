import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    createToken(id: string, role: string, secret: string) {
        return jwt.sign({ id, role }, secret, { expiresIn: '2h' });
    }

    validateToken(token: string, secret: string) {
        return jwt.verify(token, secret);
    }
}
