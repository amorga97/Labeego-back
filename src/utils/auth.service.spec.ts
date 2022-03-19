import { AuthService as auth } from './auth.service';

describe('Given the service class AuthService', () => {
    let token: string;

    describe('When calling auth.createToken', () => {
        test('Then it should return a token', () => {
            token = auth.prototype.createToken('1f1f1f1f1f1', true, 'test');
            expect(typeof token).toBe('string');
        });
    });

    describe('When calling auth.validateToken', () => {
        test('Then it should return a token', () => {
            expect(typeof auth.prototype.validateToken(token, 'test')).toBe(
                'object',
            );
        });
    });
});
