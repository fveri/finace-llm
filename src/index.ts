import { Candle, connect, getCandles } from 'tradingview-ws';
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


const startup = async () => {
  try {

    // create the mcp server.
    const server = new McpServer({
      name: "finance-mcp",
      version: "0.0.1"
    });

    server.registerTool(
      "fetch-stock",
      {
        title: "Fetch Stock",
        description: "Gets the candles data for a stock symbol for a given time interval. The interval can be a number of minutes, hours, days, weeks, or months. The amount is the number of candles to get. The symbol is the stock symbol to get candles for.",
        inputSchema: {
          symbol: z.array(z.string()),
          interval: z.string(),
          amount: z.number()
        }
      },
      async ({ symbol, interval, amount }) => {
        const candles = await getCandlesForSymbol(symbol, interval.toUpperCase() as TradingviewInterval, amount);
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

/**
 * Get candles for a given symbol, interval, and amount from tradingview.
 * @param symbols - The symbols to get candles for.
 * @param interval - The interval to get candles for.
 * @param amount - The amount of candles to get.
 * @returns An array of candles.
 */
const getCandlesForSymbol = async (symbols: string[], interval: TradingviewInterval, amount: number): Promise<Candle[][]> => {
  const connection = await connect();

  const candles = await getCandles({
    connection,
    symbols: symbols,
    timeframe: interval,
    amount: amount,
  });

  await connection.close();
  return candles;
};


startup();

type TradingviewInterval = number | '1D' | '1W' | '1M';