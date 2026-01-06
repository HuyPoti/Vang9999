import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe, UseGuards, Delete, Patch } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    create(@Body() createCommentDto: CreateCommentDto) {
        return this.commentService.create(createCommentDto);
    }

    @Get('product/:productId')
    findByProduct(
        @Param('productId', ParseUUIDPipe) productId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.commentService.findByProductId(productId, +page, +limit);
    }

    // Admin Routes
    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(
        @Query('productId') productId?: string,
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
    ) {
        return this.commentService.findAll({ productId, search, page: +page, limit: +limit });
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.commentService.remove(id);
    }

    @Patch(':id/toggle')
    @UseGuards(JwtAuthGuard)
    toggleVisibility(@Param('id', ParseUUIDPipe) id: string) {
        return this.commentService.toggleVisibility(id);
    }
}
