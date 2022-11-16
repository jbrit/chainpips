import { ChainPips__factory } from "typechain-types";

export const chainPipsContract = (provider: any) => {
    return ChainPips__factory.connect("0xfa7E117f11F63386e541cA5969ae6F49286e5AF2", provider);
};

export const USDP_ADDR = "0xEEF20045d1CC0A94D6D4Ee02dbB677FfFE45D9B9";