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

    /**
     * Lấy thống kê tổng quan về đơn hàng
     */
    async getStatistics(dateRange?: { startDate?: string; endDate?: string }) {
        const queryBuilder = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items');

        // Filter theo thời gian nếu có
        if (dateRange?.startDate) {
            queryBuilder.andWhere('order.created_at >= :startDate', {
                startDate: new Date(dateRange.startDate)
            });
        }
        if (dateRange?.endDate) {
            queryBuilder.andWhere('order.created_at <= :endDate', {
                endDate: new Date(dateRange.endDate)
            });
        }

        const orders = await queryBuilder.getMany();

        // Tính tổng số đơn hàng và doanh thu
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

        // Thống kê theo trạng thái
        const statusBreakdown = {
            pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
            confirmed: orders.filter(o => o.status === OrderStatus.CONFIRMED).length,
            shipping: orders.filter(o => o.status === OrderStatus.SHIPPING).length,
            completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
            cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
        };

        // Thống kê doanh thu theo ngày
        const dailyRevenue = this.calculateDailyRevenue(orders);

        return {
            total_orders: totalOrders,
            total_revenue: totalRevenue,
            status_breakdown: statusBreakdown,
            daily_revenue: dailyRevenue,
        };
    }

    /**
     * Tính doanh thu theo ngày
     */
    private calculateDailyRevenue(orders: Order[]) {
        const revenueMap = new Map<string, number>();

        orders.forEach(order => {
            const date = order.created_at.toISOString().split('T')[0]; // YYYY-MM-DD
            const currentRevenue = revenueMap.get(date) || 0;
            revenueMap.set(date, currentRevenue + Number(order.total_amount));
        });

        // Convert to array và sort theo ngày
        return Array.from(revenueMap.entries())
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    /**
     * Lấy thống kê theo sản phẩm
     */
    async getProductStatistics(dateRange?: { startDate?: string; endDate?: string }) {
        const queryBuilder = this.dataSource
            .getRepository(OrderItem)
            .createQueryBuilder('item')
            .innerJoin('item.order', 'order')
            .select('item.product_id', 'product_id')
            .addSelect('item.product_name', 'product_name')
            .addSelect('SUM(item.quantity)', 'total_quantity')
            .addSelect('SUM(item.price * item.quantity)', 'total_revenue')
            .addSelect('COUNT(DISTINCT item.order_id)', 'order_count');

        // Filter theo thời gian nếu có
        if (dateRange?.startDate) {
            queryBuilder.andWhere('order.created_at >= :startDate', {
                startDate: new Date(dateRange.startDate)
            });
        }
        if (dateRange?.endDate) {
            queryBuilder.andWhere('order.created_at <= :endDate', {
                endDate: new Date(dateRange.endDate)
            });
        }

        const result = await queryBuilder
            .groupBy('item.product_id')
            .addGroupBy('item.product_name')
            .orderBy('total_revenue', 'DESC')
            .getRawMany();

        return result.map(item => ({
            product_id: item.product_id,
            product_name: item.product_name,
            total_quantity: parseInt(item.total_quantity),
            total_revenue: parseFloat(item.total_revenue),
            order_count: parseInt(item.order_count),
        }));
    }

    /**
     * Export thống kê ra file Excel
     */
    async exportStatistics(res: any, dateRange?: { startDate?: string; endDate?: string }) {
        const orderStats = await this.getStatistics(dateRange);
        const productStats = await this.getProductStatistics(dateRange);

        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();

        // Sheet 1: Tổng quan
        const overviewSheet = workbook.addWorksheet('Tổng quan');
        overviewSheet.columns = [
            { header: 'Chỉ số', key: 'metric', width: 30 },
            { header: 'Giá trị', key: 'value', width: 20 },
        ];

        overviewSheet.addRow({ metric: 'Tổng số đơn hàng', value: orderStats.total_orders });
        overviewSheet.addRow({ metric: 'Tổng doanh thu', value: orderStats.total_revenue });
        overviewSheet.addRow({ metric: '' });
        overviewSheet.addRow({ metric: 'Đơn hàng theo trạng thái', value: '' });
        overviewSheet.addRow({ metric: '  - Chờ xác nhận', value: orderStats.status_breakdown.pending });
        overviewSheet.addRow({ metric: '  - Đã xác nhận', value: orderStats.status_breakdown.confirmed });
        overviewSheet.addRow({ metric: '  - Đang giao', value: orderStats.status_breakdown.shipping });
        overviewSheet.addRow({ metric: '  - Hoàn thành', value: orderStats.status_breakdown.completed });
        overviewSheet.addRow({ metric: '  - Đã hủy', value: orderStats.status_breakdown.cancelled });

        // Sheet 2: Doanh thu theo ngày
        const dailySheet = workbook.addWorksheet('Doanh thu theo ngày');
        dailySheet.columns = [
            { header: 'Ngày', key: 'date', width: 15 },
            { header: 'Doanh thu', key: 'revenue', width: 20 },
        ];
        orderStats.daily_revenue.forEach(item => {
            dailySheet.addRow(item);
        });

        // Sheet 3: Thống kê sản phẩm
        const productSheet = workbook.addWorksheet('Sản phẩm');
        productSheet.columns = [
            { header: 'Tên sản phẩm', key: 'product_name', width: 30 },
            { header: 'Số lượng bán', key: 'total_quantity', width: 15 },
            { header: 'Số đơn hàng', key: 'order_count', width: 15 },
            { header: 'Doanh thu', key: 'total_revenue', width: 20 },
        ];
        productStats.forEach(product => {
            productSheet.addRow(product);
        });

        // Set headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=statistics.xlsx',
        );

        return workbook.xlsx.write(res);
    }
}
