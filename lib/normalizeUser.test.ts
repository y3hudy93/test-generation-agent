import { describe, it, expect } from 'vitest';
import { normalizeUser } from './normalizeUser';
import { ExternalUser } from '@/types/external';

describe('normalizeUser', () => {
    it('should normalize a valid ExternalUser object', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
            subscription: {
                type: 'pro',
                expires: '2023-12-31T00:00:00Z',
            },
            permissions: ['WRITE'],
        };

        const result = normalizeUser(apiUser);

        expect(result).toEqual({
            id: '123',
            name: 'John Doe',
            isActive: true,
            createdAt: new Date('2023-01-01T00:00:00Z'),
            subscriptionType: 'pro',
            subscriptionExpiresAt: new Date('2023-12-31T00:00:00Z'),
            canEdit: true,
        });
    });

    it('should throw an error if apiUser is null', () => {
        expect(() => normalizeUser(null)).toThrow('User object is required');
    });

    it('should throw an error if apiUser is undefined', () => {
        expect(() => normalizeUser(undefined)).toThrow('User object is required');
    });

    it('should throw an error if user_id is missing', () => {
        const apiUser: ExternalUser = {
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
        };

        expect(() => normalizeUser(apiUser)).toThrow('Invalid or missing field: user_id');
    });

    it('should throw an error if full_name is missing', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
        };

        expect(() => normalizeUser(apiUser)).toThrow('Invalid or missing field: full_name');
    });

    it('should throw an error if created_at is invalid', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: 'invalid-date',
        };

        expect(() => normalizeUser(apiUser)).toThrow('Invalid date format for field: created_at');
    });

    it('should handle subscription with no type', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
            subscription: {},
        };

        const result = normalizeUser(apiUser);

        expect(result.subscriptionType).toBe('free');
        expect(result.subscriptionExpiresAt).toBeNull();
    });

    it('should handle subscription with null type', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
            subscription: {
                type: null,
            },
        };

        const result = normalizeUser(apiUser);

        expect(result.subscriptionType).toBe('free');
        expect(result.subscriptionExpiresAt).toBeNull();
    });

    it('should throw an error if subscription expires date is invalid', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
            subscription: {
                type: 'pro',
                expires: 'invalid-date',
            },
        };

        expect(() => normalizeUser(apiUser)).toThrow('Invalid date format for field: subscription.expires');
    });

    it('should handle permissions as null', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
            permissions: null,
        };

        const result = normalizeUser(apiUser);

        expect(result.canEdit).toBe(false);
    });

    it('should handle permissions as an empty array', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
            permissions: [],
        };

        const result = normalizeUser(apiUser);

        expect(result.canEdit).toBe(false);
    });

    it('should handle subscription with no expires date', () => {
        const apiUser: ExternalUser = {
            user_id: '123',
            full_name: 'John Doe',
            account_status: 'ACTIVE',
            created_at: '2023-01-01T00:00:00Z',
            subscription: {
                type: 'pro',
            },
        };

        const result = normalizeUser(apiUser);

        expect(result.subscriptionType).toBe('pro');
        expect(result.subscriptionExpiresAt).toBeNull();
    });
});