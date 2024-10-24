import { Body, Controller, Post, UseGuards, Req, Get, Delete, ParseIntPipe, Param, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { createPostDto, updateDto } from './dto/post_dto';
import { Request } from 'express';
import {  ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags("Post")
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createPostDto: createPostDto, @Req() request: Request) {
        const userId = request.user["userId"]

        return this.postService.create(createPostDto, userId)
    }

    @Get()
    getAll() {
        return this.postService.getAll()
    }

     @Get('getOnePost/:id')
     get(@Param("id", ParseIntPipe) postId: number) {
        return this.postService.getOnePost(postId)
     }
    

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    deletePost(@Param("id", ParseIntPipe) postId : number,  @Req() request : Request) {
        const userId = request.user["userId"]
        return this.postService.deletePost( postId , userId)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    updatePost(@Param("id", ParseIntPipe) postId: number, @Body() updateDto : updateDto,  @Req() request : Request) {
        const userId = request.user["userId"]
        return this.postService.updatePost( postId , updateDto,  userId)
    }


}
