import path from "path"
import fs from "fs"
import { generateTestForFile } from "./generateTest"

/**
 * Entry point for the test generation utility.
 * It generates a test for 'lib/calculateTax.ts' and saves it as a sibling '.test.ts' file.
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

        // Determine the path for the new test file (e.g., source.ts -> source.test.ts)
        const testFilePath = filePath.replace(
            ".ts",
            ".test.ts"
        )

        // Write the generated test code to the calculated file path
        fs.writeFileSync(testFilePath, testCode)

        console.log("Test file created at:", testFilePath)
    } catch (error) {
        // Log any errors encountered during the generation or file writing process
        console.error("Error:", error)
    }
}

// Execute the main function
main()