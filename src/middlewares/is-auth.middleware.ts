import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../utils/auth.service';

@Injectable()
export class IsAuth implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.get('Authorization').substring(7);
            AuthService.prototype.validateToken(token, process.env.SECRET);
            next();
        } catch (err) {
            throw new UnauthorizedException(err, err.message);
        }
    }
}
