import { describe, it, expect } from 'vitest';
import { calculateTax } from "./calculateTax";

describe('calculateTax', () => {
    it('should calculate tax correctly for a positive amount and rate', () => {
        const result = calculateTax(100, 0.15);
        expect(result).toBe(15);
    });

    it('should return 0 tax for an amount of 0', () => {
        const result = calculateTax(0, 0.15);
        expect(result).toBe(0);
    });

    it('should throw an error for a negative amount', () => {
        expect(() => calculateTax(-100, 0.15)).toThrow("Amount cannot be negative");
    });

    it('should throw an error for a rate less than 0', () => {
        expect(() => calculateTax(100, -0.01)).toThrow("Rate must be between 0 and 1");
    });

    it('should throw an error for a rate greater than 1', () => {
        expect(() => calculateTax(100, 1.01)).toThrow("Rate must be between 0 and 1");
    });

    it('should calculate tax correctly for a rate of 0', () => {
        const result = calculateTax(100, 0);
        expect(result).toBe(0);
    });

    it('should calculate tax correctly for a rate of 1', () => {
        const result = calculateTax(100, 1);
        expect(result).toBe(100);
    });
});