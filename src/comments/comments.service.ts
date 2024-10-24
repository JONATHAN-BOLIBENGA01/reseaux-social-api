import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { createCommentDto, updateCommentDto } from "./commentsDto/commentDto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CommentsService {
 
  constructor(private readonly prismaService: PrismaService) {}
  async createComment(createCommentDto: createCommentDto, userId: number) {
    const { content, postId } = createCommentDto;

    // verifier si il y un post au quel atacher le commentaire
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException("post not found");

    await this.prismaService.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });

    return {
      data: "commentaire creer !",
    };
  }

  async deleteComment(commentId: number, userId: number, postId: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: { commentId },
    });

    if (!commentId)
      throw new NotFoundException("le commentaire n'est pas trouver !");
    if (comment.postId !== postId)
      throw new UnauthorizedException(
        "le commentaire que vous vous le suprimer n'apartiend pas a cette publication"
      );
    if (comment.userId !== userId)
      throw new ForbiddenException("action interdit sur commentaire !");

    await this.prismaService.comment.delete({ where: { commentId } });

    return {
      data: "le commentaire vient d'etre suprimer !",
    };
  }
   
    async updateComment(commentId: number, updateCommentDto: updateCommentDto, userId: number) {
        const {content, postId} = updateCommentDto
        const comment = await this.prismaService.comment.findUnique({ where: { commentId } })
        if (!comment) throw new NotFoundException("le ccommentaire n'est pas trouver ")
        if (comment.postId !== postId) throw new UnauthorizedException("le commentaire que vous voulais modifier n'apartiend pas a cette publication");
        if (comment.userId !== userId) throw new ForbiddenException("action interdit sur commentaire !")
        
        await this.prismaService.comment.update({ where: { commentId }, data: { content } })
        
        return {
            data : "le commentaire vient d'etre mis a jour !"
        }
  }
    
}
