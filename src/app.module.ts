import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot({
      // adding for root will initialize this module globally
      // typeORM is the module for DB connection
      type: 'sqlite',
      database: 'db.sqlite', // connecting to sqlite db
      entities: [User, Report], // will store the list of entities being used
      synchronize: true, // when new column is added in entity, it will synchronize automatically. Useful in dev env
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
