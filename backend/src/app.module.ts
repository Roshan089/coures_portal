import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [ConfigModule, DatabaseModule, UsersModule, AuthModule, AdminModule, TeacherModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
