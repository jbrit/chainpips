import { ChainPips__factory } from "typechain-types";

export const chainPipsContract = (provider: any) => {
    return ChainPips__factory.connect("0x98aad03e9f93975c86F3385faa4fD9422807f964", provider);
};