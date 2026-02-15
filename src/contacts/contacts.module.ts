import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { ContactRequest } from './entities/contact-request.entity';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactRequest])],
  providers: [ContactsService, NotificationService],
  controllers: [ContactsController],
  exports: [ContactsService],
})
export class ContactsModule {}
