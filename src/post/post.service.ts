import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPostDto, updateDto } from './dto/post_dto';

@Injectable()
export class PostService {
    
    constructor(private readonly prismaService: PrismaService) {}
    
    async create(createPostDto: createPostDto, userId: any) {
        const { title, body } = createPostDto
        await this.prismaService.post.create({
            data: {
                title,
                body, 
                userId
            }
        })

        return {
            data : "post created !"
        }
    }

   async getAll() {
       return await this.prismaService.post.findMany({
           include: {
               user: {
                   select: {
                       username : true
                   }
               },
               Comment: {
                   include: {
                       user: {
                           select: {
                               username : true 
                           }
                       }
                   }
               }
            }
        })
   }
    
     async getOnePost(postId: number) {
         const post = await this.prismaService.post.findUnique({
             where: { postId }, include: {
                 user: {
                     select: {
                         username: true, 
                         createdAt : true
                 }
                 }, 

                 Comment: {
                   include: {
                       user: {
                           select: {
                               username : true 
                           }
                       }
                   }
               }
                 
         }})
         
        return post
    }
    
    
    async deletePost(postId: number,  userId: number) {
        // verifier si le post exist ou pas 
        const post = await this.prismaService.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException("post non trouver ! ")
        
        // la verifier la personne qui suprimer le post c'est le createur ou pas 

        if (post.userId !== userId) throw new ForbiddenException("action non authoriser !")
        
        // en suite suprimer le post

        await this.prismaService.post.delete({ where: { postId } })
        
        return {
            data : "post deleted !"
        }
        
    }

    async updatePost(postId: number, updateDto: updateDto, userId: any) {

        const post = await this.prismaService.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException("post non trouver ! ")
        
        // la verifier la personne qui suprimer le post c'est le createur ou pas 

        if (post.userId !== userId) throw new ForbiddenException("action non authoriser !")
        
        await this.prismaService.post.update({ where: { postId }, data: { ...updateDto } })
        return {
            data : 'le post a ete modifier !'
        }
        
    }
}
