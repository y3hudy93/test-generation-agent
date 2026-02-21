import { describe, it, expect } from 'vitest';
import { calculateTax } from "./calculateTax";

describe('calculateTax', () => {
    it('should calculate tax correctly for a valid amount and rate', () => {
        expect(calculateTax(100, 0.2)).toBe(20);
        expect(calculateTax(200, 0.15)).toBe(30);
    });

    it('should apply a 10% discount for amounts over 1000', () => {
        expect(calculateTax(1200, 0.2)).toBe(216); // 1200 * 0.2 * 0.9
        expect(calculateTax(1500, 0.1)).toBe(135); // 1500 * 0.1 * 0.9
    });

    it('should return 0 for an amount of 0 and rate of 0', () => {
        expect(calculateTax(0, 0)).toBe(0);
    });

    it('should throw an error for negative amount', () => {
        expect(() => calculateTax(-100, 0.2)).toThrow("Amount cannot be negative");
    });

    it('should throw an error for rate less than 0', () => {
        expect(() => calculateTax(100, -0.1)).toThrow("Rate must be between 0 and 1");
    });

    it('should throw an error for rate greater than 1', () => {
        expect(() => calculateTax(100, 1.1)).toThrow("Rate must be between 0 and 1");
    });

    it('should throw an error for negative rate with valid amount', () => {
        expect(() => calculateTax(100, -0.5)).toThrow("Rate must be between 0 and 1");
    });

    it('should throw an error for rate greater than 1 with valid amount', () => {
        expect(() => calculateTax(100, 1.5)).toThrow("Rate must be between 0 and 1");
    });
});