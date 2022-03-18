import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;

    const mockAdmin = {
        userName: 'admin123',
        name: 'Admin',
        userImage: 'some url',
        password: '12345',
        mail: 'antoniomc9719@gmail.com',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    test('/register (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/register')
            .send(mockAdmin)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        adminToken = response.text;
    });

    test('/register (POST) invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post('/register')
            .send(mockAdmin)
            .set('Accept', 'application/json');
        expect(response.status).toBe(500);
    });

    test('/login (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/login')
            .send({ userName: 'admin123', password: '12345' })
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
    });

    test('/login (POST) wrong user or pw', async () => {
        const response = await request(app.getHttpServer())
            .post('/login')
            .send({ userName: 'admin123', password: 'wrongPW' })
            .set('Accept', 'application/json');
        expect(response.status).toBe(401);
    });
});
