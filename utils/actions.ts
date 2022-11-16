import { AggregatorV3Interface__factory } from "typechain-types";
import { chainPipsContract } from "contract-factory";

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
    "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"
  );
  await tx.wait();
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

export const getPairPrice = async (provider: any) => {
    const contract = AggregatorV3Interface__factory.connect("0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526", provider);
    const price = await contract.latestRoundData();
    return price.answer.toNumber();
}

