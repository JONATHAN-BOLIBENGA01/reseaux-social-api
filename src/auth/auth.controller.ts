import { Body, Controller, Delete, Post, Req, UseGuards } from "@nestjs/common";
import {
  deleteAccountDto,
  ResetPasswordConfirmationDto,
  ResetPasswordDto,
  signupDto,
  singinDto,
} from "./dto/connexionDto";

import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { ApiTags } from "@nestjs/swagger";


@ApiTags("authentification") // pour la docummentattion de l'api

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("singup")
  singup(@Body() signupDto: signupDto) {
    return this.authService.singup(signupDto)
  }

  @Post("singin")
  singin(@Body() singinDto: singinDto) {
    return this.authService.singin(singinDto)
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post("reset-password-confirmation")
  async resetPasswordConfirmation(
    @Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto
  ) {
    return this.authService.resetPasswordConfirmation(
      resetPasswordConfirmationDto
    );
  }

  @UseGuards(AuthGuard("jwt")) // pour proteger une route
  @Delete("delete-acount")
  async deleteAccount(@Req() request : Request, @Body() deleteAccountDto : deleteAccountDto) {
    const userId = request.user["userId"]
    return this.authService.deleteAccount(userId, deleteAccountDto)
  }
}
