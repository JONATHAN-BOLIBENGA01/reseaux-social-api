import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "@nestjs/passport";
import { createCommentDto, updateCommentDto } from "./commentsDto/commentDto";
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Comment")
@ApiBearerAuth()
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("createComment")
  createCommentDto(
    @Body() createCommentDto: createCommentDto,
    @Req() request: Request
  ) {
    const userId = request.user["userId"];
    return this.commentService.createComment(createCommentDto, userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("updateComment/:id")
  updateComment(
    @Param("id", ParseIntPipe) commentId: number,
    @Body() updateCommentDto: updateCommentDto,
    @Req() request: Request
  ) {
      const userId = request.user["userId"]
      return this.commentService.updateComment(commentId, updateCommentDto, userId)
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("deleteComment/:id")
  deleteComment(
    @Param("id", ParseIntPipe) commentId: number,
    @Req() request: Request,
    @Body("postId") postId: number
  ) {
    const userId = request.user["userId"];

    return this.commentService.deleteComment(commentId, userId, postId);
  }
}
