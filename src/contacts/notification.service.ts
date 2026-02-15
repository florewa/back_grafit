import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactRequest } from './entities/contact-request.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Send notification to Telegram
   */
  async sendTelegramNotification(contact: ContactRequest): Promise<void> {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      this.logger.warn(
        'Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured',
      );
      return;
    }

    const message = this.formatTelegramMessage(contact);

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Telegram API error: ${error}`);
      }

      this.logger.log(
        `Telegram notification sent for contact request ${contact.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send Telegram notification: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Format contact request for Telegram message
   */
  private formatTelegramMessage(contact: ContactRequest): string {
    return `
🔔 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${this.escapeHtml(contact.name)}
📧 <b>Email:</b> ${this.escapeHtml(contact.email)}
${contact.phone ? `📱 <b>Телефон:</b> ${this.escapeHtml(contact.phone)}` : ''}

💬 <b>Сообщение:</b>
${this.escapeHtml(contact.message)}

🕒 <b>Дата:</b> ${contact.createdAt.toLocaleString('ru-RU')}
    `.trim();
  }

  /**
   * Escape HTML special characters for Telegram
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Send email notification (TODO: implement with nodemailer)
   */
  async sendEmailNotification(contact: ContactRequest): Promise<void> {
    const emailTo = this.configService.get<string>('NOTIFICATION_EMAIL');

    if (!emailTo) {
      this.logger.warn(
        'Email notification skipped: NOTIFICATION_EMAIL not configured',
      );
      return;
    }

    // TODO: Implement with nodemailer
    this.logger.log(
      `Email notification would be sent to ${emailTo} for contact request ${contact.id}`,
    );
  }
}
