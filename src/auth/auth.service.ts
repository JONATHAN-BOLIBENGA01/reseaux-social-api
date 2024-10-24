// c'est dans le service qu'on defini la logique metier
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { signupDto, singinDto, ResetPasswordDto, ResetPasswordConfirmationDto, deleteAccountDto } from "./dto/connexionDto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import * as speakeasy from "speakeasy";
import { MailerService } from "src/mailer/mailer.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly mailService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService : ConfigService 
  ) { } // injection de prisma service
  
  private async findUserByEmail(email: string) {
    const userfind = await this.PrismaService.user.findUnique({ where: { email } })
    return userfind
  }
  
  async singup(signupDto: signupDto) {
    const { email, password, username } = signupDto;

    //1 verifier si le user est deja inscrit
    const user = await this.findUserByEmail(email)
    console.log(user)
    if (user) throw new ConflictException("user already exists !");
    

    // hasher le mot de passe à l'aide de bcrypt
    const Hash = await bcrypt.hash(password, 10);
    // enregistrer les information d'isncription
    await this.PrismaService.user.create({
      data: {
        email,
        username,
        password: Hash,
      },
    });
    // envoyer un email de confirmation

    await this.mailService.sendingSingupConfirmation(email);
    // retourner une reponse
    return { data: "user succesfully created !" };
  }
  async singin(singinDto: singinDto) {
    const {email, password} = singinDto
    
    // verifier si l'ustilisateur existe deja
    const user =  await this.findUserByEmail(email)
    if (!user) throw new NotFoundException("user not found")
    const match = await bcrypt.compare(password,  user.password)
    
    // commparer le mot de passe entrer a celui de comla bdd
     if (!match) throw new UnauthorizedException("email or password is incorrect")
    // renvoyer un token jwt
    const payload = {
      sub: (await user).userId,
      email: (await user).email
    }

    const token = this.jwtService.sign(payload, {expiresIn: "2h", secret : this.configService.get("SECRET_KEY")})

    return {
      token, 
      user: {
        username: (await user).username, 
        email: (await user).email
      }
    }
  }


  async resetPassword(resetPasswordDto: ResetPasswordDto) {
     const {email} = resetPasswordDto
    // verifier si le user exist ou pas 
    const user = this.findUserByEmail(email)
    if (!user) throw new NotFoundException("user not found")
    
    /* 
        2er etape envoyer un code au user 
        pour reinistialiser son mot de passe
        et le code expire apres un delai
       on vas gener le code l'aide la librairie : speakeasy
    */
    const code = speakeasy.totp({
      secret: this.configService.get("OTP_CODE"),
      digits: 5, // pour un code a cinq chiffres
      step: 60 * 10, // pour 10' avant l'expireation du code
      encoding : "base32",
    })

    //url dufront pour envoyer le code 

    const url = "http://localhost:3000/auth/reset-password-confirmation"
    await this.mailService.sendResetPasswordConfirmation(email, url, code)
    return {
      data : " le code de confirmatiom est envoyer"
    }
  }

  async resetPasswordConfirmation(resetPasswordConfirmation: ResetPasswordConfirmationDto) {
    const { email, password, code } = resetPasswordConfirmation
    const user = await this.findUserByEmail(email)
    if (!user) throw new NotFoundException("user not found")
    const macth= speakeasy.totp.verify({
      secret: this.configService.get("OPT-CODE"),
      token: code,
      digits: 5, // pour un code a cinq chiffres
      step: 60 * 10, // pour 10' avant l'expireation du code
      encoding : "base32",
    })

    if (!macth) throw new UnauthorizedException("ivalid token or your token is expired !")
    const hash = await bcrypt.hash(password, 10)
    await this.PrismaService.user.update({
      where: { email },
      data: {password : hash}
    })

    return {data: "password is update ! "}
  }

  async deleteAccount(userId: number, deleteAccountDto: deleteAccountDto) {
    const {password} = deleteAccountDto
    //find user
    const user = await this.PrismaService.user.findUnique({ where: { userId } })
    if (!user) throw new NotFoundException("user not foud")
    // trouver le mot de passe 
     const match = await bcrypt.compare(password,  user.password)
    
    // commparer le mot de passe entrer a celui de comla bdd
    if (!match) throw new UnauthorizedException("email or password is incorrect")
    await this.PrismaService.user.delete({ where: { userId } })
    return {
      data : "user succesfuly deleted !"
    }
    
  }
   
}
