export const nftaddress = "0xBdBcafC02D84D8392e4530959fE9CA25C17C056f";
export const nftmarketadress = "0x58b26F8E16Df250d3Bb8DC57b2448006fF88af6a";

const BASE_BSC_SCAN_URLS = {
    97: 'https://testnet.bscscan.com'
};

export const BASE_BSC_SCAN_URL =
    BASE_BSC_SCAN_URLS[process.env.NEXT_PUBLIC_CHAIN_ID];