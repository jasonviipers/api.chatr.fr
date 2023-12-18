import { NextFunction, Request, Response } from 'express';
import { HttpStatusCodes } from '../utils/httpStatusCodes.utils';
import { LoggerUtils } from '../utils/logger.utils';
import CommunityRepository from '../repositories/community.repository';
import { createCommunitySchema } from '../schema/community.schema';
import UserRepository from '../repositories/user.repository';
import CommunityMemberRepository from '../repositories/communitymember.repository';

export default class CommunityController {
    protected request: Request;
    protected response: Response;
    protected next: NextFunction;
    protected communityRepo: CommunityRepository;
    protected userRepo: UserRepository;
    protected communityMemberRepo: CommunityMemberRepository;

    constructor(request: Request, response: Response, next: NextFunction) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.userRepo = new UserRepository();
        this.communityRepo = new CommunityRepository();
        this.communityMemberRepo = new CommunityMemberRepository();
    }

    private async handleErrors(methodName: string, error: Error): Promise<Response> {
        LoggerUtils.error(`Error during ${methodName}: ${error.message}`);
        return this.response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `An error occurred during ${methodName}.`,
        });
    }

    async createCommunity() {
        try {
            // Validate Input
            const validateInput = await createCommunitySchema.validateSync(this.request.body);

            // Create the community
            const community = await this.communityRepo.createCommunity({
                name: validateInput.name,
                slug: validateInput.slug,
            });

            // Get the creator user (if the creator authenticated and user ID is in the request)
            const creatorUserId = this.request.body.userId;
            if (creatorUserId) {
                const creatorUser = await this.userRepo.getUserById({ id: creatorUserId });

                if (!creatorUser) {
                    return this.response.status(HttpStatusCodes.NOT_FOUND).json({
                        message: 'Creator user not found.',
                    });
                }

                // Associate the creator as a member with admin role
                const adminMember = await this.communityMemberRepo.createCommunityMember({
                    role: 'ADMIN',
                    userId: creatorUserId,
                    communityId: community.id,
                });

                if (!adminMember) {
                    return this.response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: 'Error creating admin member.',
                    });
                }
            }

            // Return the community
            return this.response.status(HttpStatusCodes.CREATED).json({
                message: 'Community created successfully.',
                data: { community },
            });
        } catch (error) {
            return this.handleErrors('createCommunity', error as Error);
        }
    }

    async getAllCommunities() {
        try {
            const communities = await this.communityRepo.getAllCommunities();

            return this.response.status(HttpStatusCodes.OK).json({
                message: 'Communities retrieved successfully.',
                data: { communities },
            });
        } catch (error) {
            return this.handleErrors('getAllCommunities', error as Error);
        }
    }

    async getCommunityById() {
        try {
            const communityId = this.request.params.id;
            const community = await this.communityRepo.getCommunityById({ id: communityId });

            if (!community) {
                return this.response.status(HttpStatusCodes.NOT_FOUND).json({
                    message: 'Community not found.',
                });
            }

            return this.response.status(HttpStatusCodes.OK).json({
                message: 'Community retrieved successfully.',
                data: { community },
            });
        } catch (error) {
            return this.handleErrors('getCommunityById', error as Error);
        }
    }

    async updateCommunity() {
        try {
            const communityId = this.request.params.id;
            const community = await this.communityRepo.getCommunityById({ id: communityId });

            if (!community) {
                return this.response.status(HttpStatusCodes.NOT_FOUND).json({
                    message: 'Community not found.',
                });
            }

            const updateCommunity = await this.communityRepo.updateCommunity(
                { id: communityId },
                { ...this.request.body },
            );

            return this.response.status(HttpStatusCodes.OK).json({
                message: 'Community updated successfully.',
                data: { community: updateCommunity },
            });
        } catch (error) {
            return this.handleErrors('updateCommunity', error as Error);
        }
    }

    async deleteCommunity() {
        try {
            const communityId = this.request.params.id;
            const community = await this.communityRepo.getCommunityById({ id: communityId });

            if (!community) {
                return this.response.status(HttpStatusCodes.NOT_FOUND).json({
                    message: 'Community not found.',
                });
            }

            await this.communityRepo.deleteCommunity({ id: communityId });

            return this.response.status(HttpStatusCodes.OK).json({
                message: 'Community deleted successfully.',
            });
        } catch (error) {
            return this.handleErrors('deleteCommunity', error as Error);
        }
    }
}
