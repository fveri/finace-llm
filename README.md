# finance-llm

A mcp server for tools that allows LLMs to interact with finance tools.

# Usage

Given the prompt to Claude Sonnet 4:

> Get daily stock data for NASDAQ:NVDA since last three months. Give me some insights on the data.

The response from Claude Sonnet 4 is:

https://claude.ai/public/artifacts/e20f90ab-8cd1-4349-9475-3615f251727e

### Tools

#### fetch-stock

Gets the candles data for a stock symbol for a given time interval. The interval can be a number of minutes, hours, days, weeks, or months. The amount is the number of candles to get. The symbol is the stock symbol to get candles for.
