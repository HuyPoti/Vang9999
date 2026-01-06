import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface MailOrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface MailOrderData {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  total_price: number;
  items: MailOrderItem[];
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendOrderConfirmation(order: MailOrderData) {
    const { customer_name, email, phone, address, items, total_price, id } = order;

    const itemsHtml = items
      .map(
        (item: MailOrderItem) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(item.price)}</td>
      </tr>
    `,
      )
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #d92d20; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Lì Xì 2026</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Xác nhận đơn hàng #${id.substring(0, 8)}</h2>
          <p>Chào <strong>${customer_name}</strong>,</p>
          <p>Cảm ơn bạn đã đặt hàng tại <strong>Lì Xì 2026</strong>. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>
          
          <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Chi tiết đơn hàng</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9f9f9;">
                <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                <th style="padding: 10px; text-align: center;">SL</th>
                <th style="padding: 10px; text-align: right;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; font-weight: bold; text-align: right;">Tổng cộng:</td>
                <td style="padding: 10px; font-weight: bold; text-align: right; color: #d92d20;">${new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(total_price)}</td>
              </tr>
            </tfoot>
          </table>

          <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Thông tin giao hàng</h3>
          <p><strong>Người nhận:</strong> ${customer_name}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          <p><strong>Địa chỉ:</strong> ${address}</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #fff9f6; border-left: 4px solid #fec84b; color: #b54708;">
            <p style="margin: 0;">Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đóng gói và giao hàng.</p>
          </div>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2026 Lì Xì 2026. All rights reserved.</p>
          <p>Hotline: 0909 999 999 | Website: lixi2026.vn</p>
        </div>
      </div>
    `;

    // 1. Send to Customer
    if (email) {
      try {
        await this.transporter.sendMail({
          from: this.configService.get('SMTP_FROM'),
          to: email,
          subject: `[Lì Xì 2026] Xác nhận đơn hàng #${id.substring(0, 8)}`,
          html: htmlContent,
        });
        this.logger.log(`Confirmation email sent to customer: ${email}`);
      } catch (error) {
        this.logger.error(`Failed to send email to customer ${email}:`, error);
      }
    }

    // 2. Send to Admin
    const adminEmail = this.configService.get('ADMIN_EMAIL');
    if (adminEmail) {
      try {
        await this.transporter.sendMail({
          from: this.configService.get('SMTP_FROM'),
          to: adminEmail,
          subject: `[ADMIN] CÓ ĐƠN HÀNG MỚI #${id.substring(0, 8)}`,
          html: `
            <div style="background-color: #f0f0f0; padding: 20px;">
              <h2>Thông báo: Có đơn hàng mới đang chờ xử lý</h2>
              <p>Khách hàng: <strong>${customer_name}</strong></p>
              <p>Tổng tiền: <strong>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total_price)}</strong></p>
              <hr/>
              ${htmlContent}
            </div>
          `,
        });
        this.logger.log(`Admin notification email sent to: ${adminEmail}`);
      } catch (error) {
        this.logger.error(`Failed to send admin notification email:`, error);
      }
    }
  }
}
