import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некоректний формат email' })
  @IsNotEmpty({ message: 'Email не може бути порожнім' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не може бути порожнім' })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
