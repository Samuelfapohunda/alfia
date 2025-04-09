import {
  Controller,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmailService } from './email.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
// import { AdminGuard } from '../../common/guards/admin.guard';
// import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Email Notifications')
@ApiBearerAuth()
// @UseGuards(AuthGuard, AdminGuard)
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

//   @Post('send-create-profile/:userId')
//   @ApiOperation({ summary: 'Send "Create Your Profile" email' })
//   @ApiParam({ name: 'userId', example: '64b8f2e5a02b1f0012d2fbd3' })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: 'Email sent successfully',
//   })
//   @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
//   @HttpCode(HttpStatus.OK)
//   async sendCreateProfileEmail(@Param('userId') userId: string) {
//     await this.emailService.sendCreateProfileEmail(userId);
//     return { message: 'Profile creation email sent successfully' };
//   }

//   @Post('send-complete-profile/:userId')
//   @ApiOperation({ summary: 'Send "Complete Your Profile" email' })
//   @ApiParam({ name: 'userId', example: '64b8f2e5a02b1f0012d2fbd3' })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: 'Email sent successfully',
//   })
//   @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
//   @HttpCode(HttpStatus.OK)
//   async sendCompleteProfileEmail(@Param('userId') userId: string) {
//     await this.emailService.sendCompleteProfileEmail(userId);
//     return { message: 'Profile completion email sent successfully' };
//   }

//   @Post('send-verify-email-create-profile/:userId')
//   @ApiOperation({ summary: 'Send "Verify Email & Create Profile" email' })
//   @ApiParam({ name: 'userId', example: '64b8f2e5a02b1f0012d2fbd3' })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: 'Email sent successfully',
//   })
//   @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
//   @HttpCode(HttpStatus.OK)
//   async sendVerifyEmailAndCreateProfile(@Param('userId') userId: string) {
//     await this.emailService.sendVerifyEmailAndCreateProfileReminder(userId);
//     return {
//       message: 'Verification & Profile creation email sent successfully',
//     };
//   }
}
