import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRequest } from './entities/contact-request.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactQueryDto } from './dto/contact-query.dto';
import { NotificationService } from './notification.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactsRepository: Repository<ContactRequest>,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Create new contact request and send notifications
   */
  async create(createContactDto: CreateContactDto): Promise<ContactRequest> {
    const contact = this.contactsRepository.create(createContactDto);
    const savedContact = await this.contactsRepository.save(contact);

    // Send notifications asynchronously (don't wait)
    this.notificationService
      .sendTelegramNotification(savedContact)
      .catch((err) => console.error('Telegram notification error:', err));

    this.notificationService
      .sendEmailNotification(savedContact)
      .catch((err) => console.error('Email notification error:', err));

    return savedContact;
  }

  /**
   * Get all contact requests with pagination
   */
  async findAll(query: ContactQueryDto) {
    const { page = 1, limit = 10, isRead } = query;

    const queryBuilder = this.contactsRepository.createQueryBuilder('contact');

    // Filter by read status if provided
    if (isRead !== undefined) {
      queryBuilder.where('contact.isRead = :isRead', { isRead });
    }

    // Order by creation date (newest first)
    queryBuilder.orderBy('contact.createdAt', 'DESC');

    // Pagination
    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get contact request by ID
   */
  async findOne(id: string): Promise<ContactRequest> {
    const contact = await this.contactsRepository.findOne({ where: { id } });

    if (!contact) {
      throw new NotFoundException(`Contact request with ID '${id}' not found`);
    }

    return contact;
  }

  /**
   * Mark contact request as read
   */
  async markAsRead(id: string): Promise<ContactRequest> {
    const contact = await this.findOne(id);
    contact.isRead = true;
    return this.contactsRepository.save(contact);
  }

  /**
   * Mark contact request as unread
   */
  async markAsUnread(id: string): Promise<ContactRequest> {
    const contact = await this.findOne(id);
    contact.isRead = false;
    return this.contactsRepository.save(contact);
  }

  /**
   * Delete contact request
   */
  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactsRepository.remove(contact);
  }
}
