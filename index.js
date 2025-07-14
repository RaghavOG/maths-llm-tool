import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check if API key is available
if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set in .env file");
    process.exit(1);
}

console.log("Environment loaded successfully");

// Define math tools
const addTool = new DynamicTool({
    name: "add",
    description: "Add two numbers together",
    func: async (input) => {
        const [a, b] = input.split(",").map(Number);
        return (a + b).toString();
    },
});

const subtractTool = new DynamicTool({
    name: "subtract",
    description: "Subtract second number from first number",
    func: async (input) => {
        const [a, b] = input.split(",").map(Number);
        return (a - b).toString();
    },
});

const multiplyTool = new DynamicTool({
    name: "multiply",
    description: "Multiply two numbers together",
    func: async (input) => {
        const [a, b] = input.split(",").map(Number);
        return (a * b).toString();
    },
});

const divideTool = new DynamicTool({
    name: "divide",
    description: "Divide first number by second number",
    func: async (input) => {
        const [a, b] = input.split(",").map(Number);
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return (a / b).toString();
    },
});

// Initialize the tools array
const tools = [addTool, subtractTool, multiplyTool, divideTool];

console.log("Tools initialized");

// Initialize the LLM
const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
});

console.log("LLM initialized");

// Create a prompt template
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant that can perform math operations. Use the available tools to solve the problem."],
    ["user", "{input}"],
]);

// Create a chain
const chain = prompt.pipe(llm).pipe(new StringOutputParser());

// const chain = prompt | llm | new StringOutputParser();

console.log("Chain created");

// Main function
async function main() {
    try {
        console.log("Starting main function");
        // Example usage
        const result = await chain.invoke({
            input: "What is 78900 plus 77456 which is then divided by 250 and then multiplied by 40 and the answer is then subtracted by 10000 and then divided by 3250?",
        });
        console.log("Result:", result);
    } catch (error) {
        console.error("Error in main function:", error);
    }
}

// Run the main function
main().catch(error => {
    console.error("Unhandled error:", error);
});
