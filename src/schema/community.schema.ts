import { object, string } from 'yup';

export const createCommunitySchema = object({
    name: string().required('Name is required.').min(1, 'Name must be at least 1 character long.'),
    slug : string().required('Slug is required.').min(1, 'Slug must be at least 1 character long.'),
});