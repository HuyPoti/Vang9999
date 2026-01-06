import { Controller, Get, Post, Body, Param, Patch, ParseUUIDPipe, UseGuards, Query, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus } from '../../entities/order.entity';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.orderService.create(createOrderDto);
    }

    @Get('export')
    @UseGuards(JwtAuthGuard)
    export(@Res() res: any, @Query() query: { search?: string; status?: OrderStatus }) {
        return this.orderService.exportToExcel(res, query);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() query: { search?: string; status?: OrderStatus }) {
        return this.orderService.findAll(query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.orderService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('status') status: OrderStatus
    ) {
        return this.orderService.updateStatus(id, status);
    }
}
