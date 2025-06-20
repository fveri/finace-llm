import { Candle, connect, getCandles } from 'tradingview-ws';
import winston from "winston";

const startup = async () => {
  try {
    console.log("tradingview-mcp");

    var candles = await test_websocket();
    console.log(`got ${candles[0].length} AAPL candles`)

  } catch (err) {
    console.log(`startup error: ${(err as Error).message}`);
  }
};

const test_websocket = async (): Promise<Candle[][]> => {

  console.log("connecting to tradingview websocket..");
  const connection = await connect();

  console.log("getting candles...");
  const candles = await getCandles({
    connection,
    symbols: ['NASDAQ:AAPL'],
    amount: 10000,
    timeframe: 60
  });

  await connection.close();

  return candles;
};

startup();