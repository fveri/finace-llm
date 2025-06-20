import { Candle, connect, getCandles } from 'tradingview-ws';
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import winston from "winston";

const startup = async () => {
  try {

    // Create an MCP server
    const server = new McpServer({
      name: "tradingview-mcp",
      version: "0.0.1"
    });

    server.registerTool(
      "fetch-symbol-candles",
      {
        title: "Fetch Symbol Candles",
        description: "Get candles for a symbol",
        inputSchema: { symbol: z.string() }
      },
      async ({ symbol }) => {
        const candles = await getCandlesForSymbol(symbol);
        return {
          content: [{ type: "text", text: JSON.stringify(candles) }]
        };
      }
    );

    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (err) {
    console.log(`startup error: ${(err as Error).message}`);
  }
};

const getCandlesForSymbol = async (symbol: string): Promise<Candle[]> => {
  const connection = await connect();

  const candles = await getCandles({
    connection,
    symbols: [symbol],
    timeframe: '1D',
    amount: 300,
  });

  await connection.close();
  return candles[0];
};

/*
var candles = await test_websocket();
console.log(`got ${candles[0].length} AAPL candles`)
console.dir(candles[0][0], { depth: null })
*/


startup();

