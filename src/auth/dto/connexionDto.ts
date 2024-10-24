import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsEmail,
} from "class-validator"; /* pour faire la validation 
de donnees de l'inscription */

export class signupDto {
  // c'est ce qu'est sense recevoit le body de la requete 
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

export class singinDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

export class ResetPasswordDto {

  @ApiProperty()
  @IsEmail()
  readonly email: string;
}

export class ResetPasswordConfirmationDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly code: string;
}

export class deleteAccountDto{
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
