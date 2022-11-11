import { ChainPips__factory } from "typechain-types";

export const chainPipsContract = (provider: any) => {
    return ChainPips__factory.connect("0xbC5a3400E7F8ebb20851226fb6daf7acE7050904", provider);
};
