import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../src/utils/auth.service';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtPayload } from 'jsonwebtoken';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let nonAdminToken: string;
    let adminId: string;
    let userId: string;
    let clientId: string;
    let projectId: string;
    let taskId: string;
    let chatId: string;

    const mockAdmin = {
        userName: 'admin123',
        name: 'Admin',
        userImage: 'some url',
        password: '12345',
        mail: 'admin@gmail.com',
    };

    const mockRegularUser = {
        userName: 'user123',
        name: 'User',
        userImage: 'some url',
        password: '12345',
        mail: 'user@gmail.com',
    };

    const mockClient = {
        address: {
            street: 'test street',
            number: 23,
        },
        email: 'client@gmail.com',
        name: 'test client',
    };

    const mockProject = {
        title: 'test project',
        description: 'Project description for a test project',
        client: clientId,
    };

    const mockTask = {
        title: 'test task',
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
        adminId = (
            AuthService.prototype.validateToken(
                adminToken,
                process.env.SECRET,
            ) as JwtPayload
        ).id;
    });

    test('/register (POST) invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post('/register')
            .send(mockAdmin)
            .set('Accept', 'application/json');
        expect(response.status).toBe(500);
    });

    test('/users/new (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/new')
            .send(mockRegularUser)
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(201);
    });

    test('/users/new (POST) no token', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/new')
            .send(mockRegularUser)
            .set('Accept', 'application/json');

        expect(response.status).toBe(401);
    });

    test('/users/new (POST) invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post('/users/new')
            .send(mockRegularUser)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(500);
    });

    test('/users/:id (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${adminId}`)
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(200);
        userId = response.body.team[1]._id;
        nonAdminToken = AuthService.prototype.createToken(
            userId,
            response.body,
            process.env.SECRET,
        );
    });

    test('/users/:id (GET) without token', async () => {
        const response = await request(app.getHttpServer()).get(
            `/users/${userId}`,
        );
        expect(response.status).toBe(401);
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

    test('/users (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/users`)
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });

    test('/users (GET) user token', async () => {
        const response = await request(app.getHttpServer())
            .get(`/users`)
            .set('Authorization', `bearer ${nonAdminToken}`);
        expect(response.status).toBe(200);
    });

    test('/users/:id (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/users/${userId}`)
            .send({ name: 'updated user' })
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('updated user');
    });

    test('/users/:id (PATCH) without token', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/users/${adminId}`)
            .send({ name: 'updated user' });

        expect(response.status).toBe(401);
    });

    test('/clients (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/clients')
            .send(mockClient)
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(201);
        clientId = response.body._id.toString();
    });

    test('/clients (POST) invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post('/clients')
            .send(mockClient)
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(500);
    });

    test('/clients (POST) no token', async () => {
        const response = await request(app.getHttpServer()).post('/clients');

        expect(response.status).toBe(401);
    });

    test('/clients (POST) invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post(`/clients/`)
            .send({ name: '' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(500);
    });

    test('/clients (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/clients/`)
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });

    test('/clients (GET)', async () => {
        const response = await request(app.getHttpServer()).get(`/clients/`);

        expect(response.status).toBe(401);
    });

    test('/clients/:id (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/clients/${clientId}`)
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });

    test('/clients/:id (GET)', async () => {
        const response = await request(app.getHttpServer()).get(
            `/clients/${clientId}`,
        );
        expect(response.status).toBe(401);
    });

    test('/clients/:id (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/clients/${clientId}`)
            .send({ name: 'updated client' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('updated client');
    });

    test('/projects (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/projects/new')
            .send(mockProject)
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(201);
        expect(response.body.tasks).toHaveLength(6);
        projectId = response.body._id.toString();
    });

    test('/projects (POST) invalid data', async () => {
        const response = await request(app.getHttpServer())
            .post('/projects/new')
            .send({ title: '' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(500);
    });

    test('/projects/:id (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/projects/${projectId}`)
            .send({ title: 'updated project' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('updated project');
    });

    test('/projects/:id (PATCH) non admin and not own project', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/projects/${projectId}`)
            .send({ title: 'updated project' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${nonAdminToken}`);

        expect(response.body).toEqual({});
    });

    test('/projects/:id (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/projects/${projectId}`)
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('updated project');
    });

    test('/projects (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/projects`)
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('length');
    });

    test('/tasks/:projectId (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post(`/tasks/${projectId}`)
            .send(mockTask)
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(201);
        taskId = response.body._id.toString();
    });

    test('/tasks/:projectId (POST) bad projectId', async () => {
        const response = await request(app.getHttpServer())
            .post(`/tasks/${projectId + '123'}`)
            .send(mockTask)
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(500);
    });

    test('/tasks/:projectId (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/tasks/${projectId}`)
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('length');
    });

    test('/tasks/:projectId (GET) bad projectId', async () => {
        const response = await request(app.getHttpServer())
            .get(`/tasks/${projectId + '123'}`)
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(500);
    });

    test('/tasks/:projectId/:taskId (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/tasks/${projectId}/${taskId}`)
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(200);
    });

    test('/tasks/:projectId/:taskId (GET) bad projectId or taskId', async () => {
        const response = await request(app.getHttpServer())
            .get(`/tasks/${projectId}/${taskId + '123'}`)
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(500);
    });

    test('/tasks/:projectId/:taskId (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/tasks/${projectId}/${taskId}`)
            .send({ title: 'updated task' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('updated task');
    });

    test('/tasks/:projectId/:taskId (PATCH) bad taskId or projectID', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/tasks/${projectId + '123'}/${taskId}`)
            .send({ title: 'updated task' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(500);
    });

    test('/chats/ (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/chat`)
            .set('Authorization', `bearer ${nonAdminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('length');
        chatId = response.body[0]._id.toString();
    });

    test('/chats/:id (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get(`/chat/${chatId}`)
            .set('Authorization', `bearer ${nonAdminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('users');
    });

    test('/chats/:id (GET) bad id', async () => {
        const response = await request(app.getHttpServer())
            .get(`/chat/${chatId + '123'}`)
            .set('Authorization', `bearer ${nonAdminToken}`);

        expect(response.status).toBe(500);
    });

    test('/chats/:id (PATCH)', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/chat/${chatId}`)
            .send({ text: 'test message' })
            .set('Authorization', `bearer ${nonAdminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.messages[0].text).toBe('test message');
    });

    test('/chats/:id (PATCH) bad id', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/chat/${chatId + '123'}`)
            .send({ text: 'test message' })
            .set('Authorization', `bearer ${nonAdminToken}`);

        expect(response.status).toBe(500);
    });

    //DELETESDELETESDELETESDELETES
    //DELETESDELETESDELETESDELETES
    //DELETESDELETESDELETESDELETES
    //DELETESDELETESDELETESDELETES
    //DELETESDELETESDELETESDELETES

    test('/tasks/:projectId/:taskId (DELETE)', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/tasks/${projectId}/${taskId}`)
            .send({ title: 'updated task' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(200);
    });

    test('/tasks/:projectId/:taskId (DELETE) bad taskId or projectId', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/tasks/${projectId + '123'}/${taskId}`)
            .send({ title: 'updated task' })
            .set('Accept', 'application/json')
            .set('Authorization', `bearer ${adminToken}`);

        expect(response.status).toBe(500);
    });

    test('/users/:id (DELETE) admin', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${adminId}`)
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });

    test('/users/:id (DELETE) non admin', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${userId}`)
            .set('Authorization', `bearer ${nonAdminToken}`);
        expect(response.status).toBe(200);
    });

    test('/clients/:id (DELETE)', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/clients/${clientId}`)
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });

    test('/projects/:id (DELETE) non admin', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/projects/${projectId}`)
            .set('Authorization', `bearer ${nonAdminToken}`);
        expect(response.status).toBe(401);
    });

    test('/projects/:id (DELETE)admin', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/projects/${projectId}`)
            .set('Authorization', `bearer ${adminToken}`);
        expect(response.status).toBe(200);
    });
});
