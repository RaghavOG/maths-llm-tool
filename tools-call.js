import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set in .env file");
    process.exit(1);
}

console.log("Environment loaded successfully");

// Define tools
const addTool = new DynamicTool({
    name: "add",
    description: "Add two numbers together. Input format: 'a,b'",
    func: async (input) => {
        const [a, b] = input.split(",").map(Number);
        return (a + b).toString();
    },
});

const subtractTool = new DynamicTool({
    name: "subtract",
    description: "Subtract second number from first number. Input format: 'a,b'",
    func: async (input) => {
        const [a, b] = input.split(",").map(Number);
        return (a - b).toString();
    },
});

const multiplyTool = new DynamicTool({
    name: "multiply",
    description: "Multiply two numbers together. Input format: 'a,b'",
    func: async (input) => {
        const [a, b] = input.split(",").map(Number);
        return (a * b).toString();
    },
});

const divideTool = new DynamicTool({
    name: "divide",
    description: "Divide first number by second number. Input format: 'a,b'",
    func: async (input) => {
        const [a, b] = input.split(",").map(Number);
        if (b === 0) throw new Error("Cannot divide by zero");
        return (a / b).toString();
    },
});

const tools = [addTool, subtractTool, multiplyTool, divideTool];

const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
});

async function main() {
    console.log("Setting up agent executor with tools...");

    const executor = await initializeAgentExecutorWithOptions(tools, llm, {
        agentType: "openai-functions", // This supports tool usage
        verbose: true,
    });

    console.log("Agent initialized. Running query...");

    const result = await executor.invoke({
        input: "What is 5 plus 5 which is then divided by 2 and then multiplied by 40 and the answer is then subtracted by 100 and then divided by 50?",
    });

    console.log("Final result:", result.output);
}

main().catch(err => console.error("Unhandled error:", err));
