import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import LogsMiddleware from './utils/logs.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserCrudModule } from './users/user.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { ProjectModule } from './project/project.module';
import { TasksModule } from './tasks/tasks.module';
import { ClientsModule } from './clients/clients.module';
import { IsAuth } from './middlewares/is-auth.middleware';
@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.MONGO_USER}:${
                process.env.PASSWORD
            }@cluster0.pauk1.mongodb.net/${
                process.env.NODE_ENV === 'test'
                    ? process.env.TEST_DBNAME
                    : process.env.DBNAME
            }?retryWrites=true&w=majority`,
        ),
        UserCrudModule,
        LoginModule,
        RegisterModule,
        ProjectModule,
        TasksModule,
        ClientsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LogsMiddleware).forRoutes('*');
        consumer
            .apply(IsAuth)
            .forRoutes('users', 'projects', 'tasks', 'clients');
    }
}
