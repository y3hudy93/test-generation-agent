# Agentic Test Generation Agent

An advanced AI-powered testing agent designed to scan TypeScript codebases, generate high-quality Vitest tests, and iteratively improve them until 100% logical coverage is achieved.

## 🚀 Key Features

- **Automated Discovery:** Automatically scans the `lib/` directory for source files lacking corresponding `.test.ts` files.
- **AI-Driven Test Generation:** Leverages OpenAI's `gpt-4o-mini` to author comprehensive test suites targeting edge cases and error handling.
- **Coverage-Driven Feedback Loop:** Uses a specialized parser (`readCoverage.ts`) to extract uncovered branch data from Vitest reports.
- **Self-Healing Loop:** Automatically fixes failing tests and adds missing coverage by feeding error logs and coverage gaps back to the LLM.
- **Context-Aware:** Resolves path aliases and dependencies to provide the LLM with relevant type information and signatures.

## 🛠️ Architecture

The project is structured into two main components:

### 1. Agent Core (`/agent`)
- **`runAgent.ts`**: The orchestrator. It manages the loop of discovery, generation, execution, and refinement.
- **`readCoverage.ts`**: A technical parser that translates Vitest's `coverage-final.json` into a list of specific source line numbers representing uncovered branches.
- **`generateTest.ts`**: Handles prompt construction and OpenAI API interaction. It includes logic for both initial generation and iterative fixing.
- **`resolveDependencies.ts`**: Scans source files for `@/types` imports to include relevant context in the generation prompts.
- **`runVitest.ts`**: Executes the Vitest CLI and captures results.
- **`scanFiles.ts`**: Utility to identify untested business logic in the `lib/` directory.

### 2. Business Logic (`/lib`)
- Contains the application's core logic (e.g., `normalizeUser.ts`, `calculateTax.ts`), which the agent targets for test generation.

## 🚦 Getting Started

### Prerequisites
- Node.js (v25+)
- OpenAI API Key

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

### Running the Agent

To start the automated test generation process:
```bash
npm run agent:run
```

The agent will:
1. Find files in `lib/` without tests.
2. Generate an initial test file.
3. Run `vitest --coverage`.
4. If coverage is < 98% or tests fail, it will request fixes from the AI.
5. Repeat until the threshold is met or `maxAttempts` (3) is reached.

## 🧪 Tech Stack
- **Framework:** Next.js
- **Testing:** Vitest + v8 Coverage
- **AI Engine:** OpenAI gpt-4o-mini
- **Language:** TypeScript
