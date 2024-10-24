import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'


export class createPostDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly title: string
    
    @IsNotEmpty()
    readonly body : string
}


export class updateDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    readonly title?: string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    readonly body?: string
}