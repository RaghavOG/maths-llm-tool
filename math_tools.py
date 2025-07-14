from typing import Dict, Type, Any
from langchain_core.tools import BaseTool
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.agents import create_openai_functions_agent
from langchain.agents import AgentExecutor
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class AddTool(BaseTool):
    name: str = "add"
    description: str = "Add two numbers together"
    
    def _run(self, a: float, b: float) -> float:
        return a + b

class SubtractTool(BaseTool):
    name: str = "subtract"
    description: str = "Subtract second number from first number"
    
    def _run(self, a: float, b: float) -> float:
        return a - b

class MultiplyTool(BaseTool):
    name: str = "multiply"
    description: str = "Multiply two numbers together"
    
    def _run(self, a: float, b: float) -> float:
        return a * b

class DivideTool(BaseTool):
    name: str = "divide"
    description: str = "Divide first number by second number"
    
    def _run(self, a: float, b: float) -> float:
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b

# Initialize the tools
tools = [AddTool(), SubtractTool(), MultiplyTool(), DivideTool()]

# Initialize the LLM
llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0
)

# Create a prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that can perform math operations. Use the available tools to solve the problem."),
    ("user", "{input}"),
    ("assistant", "Let me help you solve this step by step."),
    ("user", "{agent_scratchpad}")
])

# Create the agent
agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

def main():
    # Example usage
    result = agent_executor.invoke({"input": "What is 5 plus 5 which is then divided by 2 and then multiplied by 40 and the answer is then subtracted by 100 and then divided by 50?"})
    print(result)

if __name__ == "__main__":
    main() 