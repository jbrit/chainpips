import { ChainPips__factory, ERC20__factory} from "typechain-types";

export const chainPipsContract = (provider: any) => {
    return ChainPips__factory.connect("0x720d45aB23a02000c2d61079361Ca43417db25a9", provider);
};

export const USDP_ADDR = "0xEEF20045d1CC0A94D6D4Ee02dbB677FfFE45D9B9";

export const erc20Contract = (provider: any) => ERC20__factory.connect(USDP_ADDR, provider);