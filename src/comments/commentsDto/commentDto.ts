import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'


export class createCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly content: string;

    @IsNotEmpty()
    readonly postId : number
    
}


export class updateCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly content: string;
    
    @ApiProperty()
    @IsNotEmpty()
    readonly postId : number
    
}


