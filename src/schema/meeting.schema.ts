import { object, string } from 'yup';

export const createMeetingSchema = object({
    title: string().required('Title is required.').min(3, 'Title must be at least 3 characters long.'),
    description: string().optional().min(3, 'Description must be at least 3 characters long.'),
    startTime: string().required('Start time is required.'),
    endTime: string().required('End time is required.'),
    hostId: string().required('Host is required.'),
});

export const updateMeetingSchema = object({
    title: string().optional().min(3, 'Title must be at least 3 characters long.'),
    description: string().optional().min(3, 'Description must be at least 3 characters long.'),
    startTime: string().optional(),
    endTime: string().optional(),
    hostId: string().optional(),
});

