/**
 * Computes the tax for a given amount based on a decimal rate.
 * 
 * @param amount - The base amount to calculate tax on. Must be non-negative.
 * @param rate - The tax rate (e.g., 0.15 for 15%). Must be between 0 and 1.
 * @returns The calculated tax amount.
 * @throws Error if amount is negative or rate is outside the [0, 1] range.
 */
export function calculateTax(amount: number, rate: number): number {
    if (amount < 0) {
        throw new Error("Amount cannot be negative")
    }

    if (rate < 0 || rate > 1) {
        throw new Error("Rate must be between 0 and 1")
    }

    return amount * rate
}