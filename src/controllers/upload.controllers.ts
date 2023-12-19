import { Request, Response, NextFunction } from 'express';
import { HttpStatusCodes } from '../utils/httpStatusCodes.utils';
import { LoggerUtils } from '../utils/logger.utils';
import mkdirp from 'mkdirp';
import fs from 'fs';
import UserService from '../repositories/user.repository';

export default class UploadController {
    protected request: Request;
    protected response: Response;
    protected next: NextFunction;
    protected userService: UserService;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.userService = new UserService();
    }

    private async handleFileUpload(type: string, successMessage: string): Promise<void> {
        try {
            const { id } = this.request.user;
            const { file } = this.request;

            if (!file) {
                LoggerUtils.error('No file provided');
                throw new Error('No file provided');
            }

            const user = await this.userService.getUserById(id);

            if (!user) {
                LoggerUtils.error('User not found');
                throw new Error('User not found');
            }

            const uploadPath = `./uploads/${id}/${type}`;

            mkdirp.sync(uploadPath);

            const filePath = `${uploadPath}/${file.originalname}`;

            await fs.promises.writeFile(filePath, file.buffer);

            this.response.status(HttpStatusCodes.OK).json({
                message: successMessage,
                data: filePath,
            });
        } catch (error) {
            LoggerUtils.error(`Error uploading ${type}: ${error}`);
            this.next(error);
        }
    }

    async uploadAvatar(): Promise<void> {
        try {
            await Promise.all([
                this.handleFileUpload('avatar', 'Avatar uploaded successfully'),
                this.userService.updateUser(this.request.user.id, {
                    imageUri: this.request.file?.originalname,
                }),
            ]);

            this.response.status(HttpStatusCodes.OK).json({
                message: 'Avatar and user updated successfully',
            });
        } catch (error) {
            LoggerUtils.error(`Error uploading avatar: ${error}`);
            this.next(error);
        }
    }

    async uploadPostImage(): Promise<void> {
        try {
            await Promise.all([
                this.handleFileUpload('post/image', 'Post image uploaded successfully'),
                this.userService.updateUser(this.request.user.id, {
                    imageUri: this.request.file?.originalname,
                }),
            ]);

            this.response.status(HttpStatusCodes.OK).json({
                message: 'Post image and user updated successfully',
            });
        } catch (error) {
            LoggerUtils.error(`Error uploading post image: ${error}`);
            this.next(error);
        }
    }

    async uploadPostVideo(): Promise<void> {
        try {
            await Promise.all([
                this.handleFileUpload('post/video', 'Post video uploaded successfully'),
                this.userService.updateUser(this.request.user.id, {
                    //  videoUri: this.request.file?.originalname,
                }),
            ]);

            this.response.status(HttpStatusCodes.OK).json({
                message: 'Post video and user updated successfully',
            });
        } catch (error) {
            LoggerUtils.error(`Error uploading post video: ${error}`);
            this.next(error);
        }
    }
}
