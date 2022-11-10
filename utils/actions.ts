import { chainPipsContract } from "contract-factory";
import { type } from "os";

export enum TradeType {
  Buy = 0,
  Sell = 1,
}

export const openTrade = async (
  provider: any,
  amount: number,
  _type: TradeType
) => {
  const contract = chainPipsContract(provider);
  const tx = await contract.openTrade(
    _type,
    amount,
    "0xcD4bde67fe7C6Eb601d03a35Ea8a55eB2b136965"
  );
  await tx.wait(2);
  return tx;
};

export const openBuyTrade = async (provider: any, amount: number) =>
  await openTrade(provider, amount, TradeType.Buy);
export const openSellTrade = async (provider: any, amount: number) =>
  await openTrade(provider, amount, TradeType.Sell);

export const closeTrade = async (provider: any, tradeId: number) => {
  const contract = chainPipsContract(provider);
  const tx = await contract.closeTrade(tradeId);
  await tx.wait(2);
  return tx;
};

type Position = {
    id: number;
    trader: string;
    tradeType: TradeType;
    tradingPair: string;
    amount: number;
    entryPrice: number;
    exitPrice: number;
    entryTime: number;
    exitTime: number;
}

export const getPositions = async (provider: any) => {
  const contract = chainPipsContract(provider);
  const count = (await contract.getPositionCount()).toNumber();
  const positions = [];
  for (let i = 0; i < count; i++) {
    const position = await contract.positions(i);
    positions.push({
        id: position.id.toNumber(),
        trader: position.trader,
        amount: position.amount.toNumber(),
        entryPrice: position.entryPrice.toNumber(),
        entryTime: position.entryTime.toNumber(),
        exitPrice: position.exitPrice.toNumber(),
        exitTime: position.exitTime.toNumber(),
        tradeType: position.tradeType,
        tradingPair: position.tradingPair,
    } as Position);
  }
  return positions;
};
