import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { OrderStatus } from '../../entities/order.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly dataSource: DataSource,
        private readonly mailService: MailService,
    ) { }

    async create(createOrderDto: CreateOrderDto) {
        this.logger.log(`Incoming order request for customer: ${createOrderDto.customer_name}`);
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Calculate total amount
            const totalAmount = createOrderDto.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );

            // 2. Create Order
            const order = this.orderRepository.create({
                customer_name: createOrderDto.customer_name,
                email: createOrderDto.email,
                phone: createOrderDto.phone,
                address: createOrderDto.address,
                note: createOrderDto.note,
                status: OrderStatus.PENDING,
                total_amount: totalAmount,
            });

            const savedOrder = await queryRunner.manager.save(order);

            // 3. Create Order Items
            const orderItems = createOrderDto.items.map((item) => {
                return queryRunner.manager.create(OrderItem, {
                    order: savedOrder, // Link to parent
                    product_id: item.product_id,
                    product_name: item.product_name, // Snapshot
                    price: item.price, // Snapshot
                    quantity: item.quantity,
                });
            });

            await queryRunner.manager.save(orderItems);

            // 4. Commit transaction
            await queryRunner.commitTransaction();

            this.logger.log(`Order created successfully: ${savedOrder.id}`);

            // 5. Send order confirmation email (async, don't block response)
            this.logger.log(`Preparing to send confirmation email to: ${savedOrder.email}`);
            this.mailService.sendOrderConfirmation({
                ...savedOrder,
                items: orderItems,
                total_price: totalAmount,
            }).catch(e => this.logger.error(`Error sending confirmation email: ${e.message}`));

            return {
                status: 'success',
                data: {
                    order_id: savedOrder.id,
                    total_amount: totalAmount,
                    message: 'Order created successfully',
                },
            };
        } catch (err) {
            this.logger.error(`Failed to create order: ${err.message}`, err.stack);
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(query?: { search?: string; status?: OrderStatus }) {
        const queryBuilder = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .orderBy('order.created_at', 'DESC');

        if (query?.status) {
            queryBuilder.andWhere('order.status = :status', { status: query.status });
        }

        if (query?.search) {
            queryBuilder.andWhere(
                '(order.customer_name ILIKE :search OR order.phone ILIKE :search OR order.email ILIKE :search)',
                { search: `%${query.search}%` }
            );
        }

        return queryBuilder.getMany();
    }

    async exportToExcel(res: any, query?: { search?: string; status?: OrderStatus }) {
        const orders = await this.findAll(query);
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');

        worksheet.columns = [
            { header: 'Mã đơn hàng', key: 'id', width: 36 },
            { header: 'Khách hàng', key: 'customer_name', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Số điện thoại', key: 'phone', width: 15 },
            { header: 'Địa chỉ', key: 'address', width: 40 },
            { header: 'Tổng tiền', key: 'total_amount', width: 15 },
            { header: 'Trạng thái', key: 'status', width: 15 },
            { header: 'Ngày đặt', key: 'created_at', width: 20 },
            { header: 'Ghi chú', key: 'note', width: 30 }
        ];

        orders.forEach(order => {
            worksheet.addRow({
                ...order,
                created_at: order.created_at.toLocaleString('vi-VN')
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'orders.xlsx',
        );

        return workbook.xlsx.write(res);
    }

    findOne(id: string) {
        return this.orderRepository.findOne({
            where: { id },
            relations: ['items']
        });
    }

    async updateStatus(id: string, status: OrderStatus) {
        const order = await this.findOne(id);
        if (!order) {
            throw new Error('Đơn hàng không tồn tại');
        }

        // Strict Status Transition Rules
        if (order.status === OrderStatus.PENDING) {
            if (![OrderStatus.CONFIRMED, OrderStatus.CANCELLED].includes(status)) {
                throw new Error('Đơn hàng mới chỉ có thể Xác nhận hoặc Hủy');
            }
        } else if (order.status === OrderStatus.CONFIRMED) {
            if (![OrderStatus.SHIPPING, OrderStatus.CANCELLED].includes(status)) {
                throw new Error('Đơn hàng đã xác nhận cần được Chuyển hàng trước khi Hoàn thành');
            }
        } else if (order.status === OrderStatus.SHIPPING) {
            if (![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(status)) {
                throw new Error('Đơn hàng đang giao chỉ có thể Hoàn thành hoặc Hủy');
            }
        } else if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
            throw new Error('Không thể thay đổi trạng thái của đơn hàng đã kết thúc');
        }

        order.status = status;
        return this.orderRepository.save(order);
    }
}
