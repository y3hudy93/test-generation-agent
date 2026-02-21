/**
 * Calculates the tax for a given amount and rate.
 * 
 * @param amount - The base amount to calculate tax on (must be non-negative).
 * @param rate - The tax rate (must be between 0 and 1).
 * @returns The calculated tax amount, with a 10% discount for amounts over 1000.
 * @throws Error if amount or rate are invalid.
 */
export function calculateTax(amount: number, rate: number): number {
    if (amount < 0) {
        throw new Error("Amount cannot be negative")
    }

    if (rate < 0 || rate > 1) {
        throw new Error("Rate must be between 0 and 1")
    }

    if (amount === 0 && rate === 0) {
        return 0
    }

    if (amount > 1000) {
        // Apply a 10% discount for large amounts
        return amount * rate * 0.9
    }

    return amount * rate
}
