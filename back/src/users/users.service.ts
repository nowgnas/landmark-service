import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { insertUserDto } from './dto/insert.user.dto';
import { Users } from './users.entity';
import { AuthService } from 'src/auth/auth.service';
import { currentUserInfo } from './dto/current-user.dto';
import { resetPassword } from './dto/find.password.input.dto';
import { EmailService } from 'src/email/email.service';
import { updateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USERS_REPOSITORY')
        private userRepository: Repository<Users>,
        private readonly authService: AuthService,
        private readonly mailService: EmailService,
    ) {}

    async create(userDto: insertUserDto): Promise<Users> {
        // 사용자 등록
        const newUser = await this.authService.register(userDto);
        const user = this.userRepository.save(newUser);
        return user;
    }

    async logout(userId: string) {
        // logout 시 refresh tonen null로 저장
    }

    async getAllUsers(): Promise<Users[]> {
        const users = await this.userRepository.find({});
        return users;
    }

    async getCurrentUserInfo(id: string): Promise<currentUserInfo> {
        const user = await this.userRepository.findOne({
            where: { user_id: id },
        });
        const { password, hashedRefreshToken, ...userInfo } = user;
        return userInfo;
    }

    async sendMailForResetPassword(resetInfo: resetPassword) {
        const randNumber: number = Math.ceil(
            Math.random() * (999999999 - 111111111) + 111111111,
        );
        await this.authService.resetPassword(
            randNumber.toString(),
            resetInfo.email,
            resetInfo.name,
        );
        await this.mailService.sendMemberJoinVerification(
            randNumber.toString(),
            resetInfo.email,
        );
    }

    async updateUserInfo(updateUser: updateUserDto, user_id: string) {
        const user = await this.userRepository.findOneBy({
            user_id: user_id,
        });
        await this.authService.verifyPassword(
            // 비밀번호 확인
            updateUser.prePassword,
            user.password,
        );

        if (updateUser.newPassword.length !== 0) {
            // new password가 존재하는 경우
            user.password = await this.authService.hashedPassword(
                updateUser.newPassword,
            );
        }

        user.name = updateUser.name || user.name;
        user.profile_image = updateUser.profile_image || user.profile_image;

        await this.userRepository.save(user);
    }
}
