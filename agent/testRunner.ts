import path from "path"
import { generateTestForFile } from "./generateTest"

/**
 * Entry point for the test generation utility.
 * It demonstrates generating a test for a specific library file (calculateTax.ts).
 */
async function main() {
    try {
        // Define the path to the library file we want to test
        const filePath = path.join(
            process.cwd(),
            "lib",
            "calculateTax.ts"
        )

        // Trigger the automated test generation
        const testCode = await generateTestForFile(filePath)

        // Output the generated result to the console
        console.log("\n===== GENERATED TEST =====\n")
        console.log(testCode)
    } catch (error) {
        // Log any errors encountered during the generation process
        console.error("Error generating test:", error)
    }
}

// Execute the main function
main()