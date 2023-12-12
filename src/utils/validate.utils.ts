import * as z from 'zod';

export const registerSchema = z.object({
    name: z.string().min(1, { message: 'Name cannot be empty.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
        .string()
        .min(8, { message: 'Password must be 8 or more characters long' })
        .max(32, { message: 'Password must be a maximum of 32 characters long' })
        .regex(new RegExp('.*[A-Z].*'), {
            message: 'At least one uppercase character',
        })
        .regex(new RegExp('.*[a-z].*'), {
            message: 'At least one lowercase character',
        })
        .regex(new RegExp('.*\\d.*'), { message: 'At least one number' }),
    confirmPassword: z
        .string()
        .regex(new RegExp('.*[A-Z].*'), {
            message: 'At least one uppercase character',
        })
        .regex(new RegExp('.*[a-z].*'), {
            message: 'At least one lowercase character',
        })
        .regex(new RegExp('.*\\d.*'), { message: 'At least one number' })
        .min(8, { message: 'Password must be 8 or more characters long' })
        .max(32, { message: 'Password must be a maximum of 32 characters long' }),
});

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(8, { message: 'Password must be 8 or more characters long' }),
});

export const passwordLessLoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(8, { message: 'Password must be 8 or more characters long' }),
    newPassword: z
        .string()
        .min(8, { message: 'Password must be 8 or more characters long' })
        .regex(new RegExp('.*[A-Z].*'), {
            message: 'At least one uppercase character',
        })
        .regex(new RegExp('.*[a-z].*'), {
            message: 'At least one lowercase character',
        })
        .regex(new RegExp('.*\\d.*'), { message: 'At least one number' }),
    confirmNewPassword: z
        .string()
        .regex(new RegExp('.*[A-Z].*'), {
            message: 'At least one uppercase character',
        })
        .regex(new RegExp('.*[a-z].*'), {
            message: 'At least one lowercase character',
        })
        .regex(new RegExp('.*\\d.*'), { message: 'At least one number' })
        .min(8, { message: 'Password must be 8 or more characters long' }),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: 'Password must be 8 or more characters long' })
        .regex(new RegExp('.*[A-Z].*'), {
            message: 'At least one uppercase character',
        })
        .regex(new RegExp('.*[a-z].*'), {
            message: 'At least one lowercase character',
        })
        .regex(new RegExp('.*\\d.*'), { message: 'At least one number' }),
    confirmPassword: z
        .string()
        .min(8, { message: 'Password must be 8 or more characters long' })
        .regex(new RegExp('.*[A-Z].*'), {
            message: 'At least one uppercase character',
        })
        .regex(new RegExp('.*[a-z].*'), {
            message: 'At least one lowercase character',
        }),
});

export const verifyEmailSchema = z.object({
    verifyToken: z.string().min(1, { message: 'Invalid token.'}),
});

export const createMeetingSchema = z.object({
    title: z.string(),
    description: z.string(),
    // participants: z.array(z.string()),
    // startDate: z.string(),
    // endDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    hostId: z.string(),
});

export const updateMeetingSchema = z.object({
    title: z.string(),
    description: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    participants: z.array(z.string()),
});

export const createMessageSchema = z.object({
    content: z.string().nonempty('Content cannot be empty.'),
    meetingId: z.string(),
    userId: z.string(),
});

export const updateMessageSchema = z.object({
    content: z.string(),
    meetingId: z.string(),
    userId: z.string(),
});

export const createParticipantSchema = z.object({
    meetingId: z.string(),
    userId: z.string(),
});

export const updateParticipantSchema = z.object({
    meetingId: z.string(),
    userId: z.string(),
});

export const createCommentSchema = z.object({
    content: z.string(),
    messageId: z.string(),
    userId: z.string(),
});

export const updateCommentSchema = z.object({
    content: z.string(),
    messageId: z.string(),
    userId: z.string(),
});
