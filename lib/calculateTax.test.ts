import { describe, it, expect } from 'vitest';
import { calculateTax } from "./calculateTax";

describe('calculateTax', () => {
    it('should calculate tax correctly for a valid amount and rate', () => {
        expect(calculateTax(100, 0.15)).toBe(15);
        expect(calculateTax(200, 0.2)).toBe(40);
        expect(calculateTax(0, 0.1)).toBe(0);
    });

    it('should throw an error if the amount is negative', () => {
        expect(() => calculateTax(-100, 0.15)).toThrowError("Amount cannot be negative");
    });

    it('should throw an error if the rate is less than 0', () => {
        expect(() => calculateTax(100, -0.1)).toThrowError("Rate must be between 0 and 1");
    });

    it('should throw an error if the rate is greater than 1', () => {
        expect(() => calculateTax(100, 1.1)).toThrowError("Rate must be between 0 and 1");
    });

    it('should handle edge case of zero amount with valid rate', () => {
        expect(calculateTax(0, 0)).toBe(0);
        expect(calculateTax(0, 1)).toBe(0);
    });

    it('should handle edge case of valid amount with zero rate', () => {
        expect(calculateTax(100, 0)).toBe(0);
    });
});