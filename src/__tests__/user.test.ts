import request from 'supertest';
import app from '../app';


describe('Auth Controller Tests', () => {
    it('should be able to create a new user', async () => {
        const response = await request(app).post('/auth/register').send({
            name: 'Test User',
            email: 'test@email.com',
            password: 'Upt5@Rhjjgg=',
            confirmPassword: 'Upt5@Rhjjgg=',
        });

        expect(response.status).toBe(201);
    });
});
