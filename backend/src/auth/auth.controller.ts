import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/index';
import { JwtAuthGuard } from '../common/guards/index';
import { CurrentUser, Public, Roles } from '../common/decorators/index';
import { Role } from '../common/enums/index';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tizimga kirish' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, req.ip);

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth/refresh',
    });

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('register')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Yangi foydalanuvchi qo\'shish (Admin)' })
  async register(
    @Body() dto: RegisterDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.authService.register(dto, tenantId);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Access tokenni yangilash' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token topilmadi' });
    }

    // Decode to get userId (without verifying — service does that)
    const payload = JSON.parse(
      Buffer.from(refreshToken.split('.')[1], 'base64').toString(),
    );

    const tokens = await this.authService.refreshTokens(payload.sub, refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Tizimdan chiqish' })
  async logout(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Joriy foydalanuvchi ma\'lumotlari' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Parolni o\'zgartirish' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }
}
