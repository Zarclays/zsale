 export interface CampaignDetails {
    tokenAddress: string;
    
    softCap?: string;
    hardCap?: string;
    saleStartTime?: string;
    saleEndTime?: string;
    liquidityPercent: string;
    listRate: string;
    dexListRate: string;
    useWhiteList: boolean;
    hasKYC?: boolean;
    isAudited?: boolean;
    refundType?: string;
    logoUrl?: string;
    desc?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    name?: string;
    symbol?: string;
    decimals?: string;
    totalSupply?: string;
    minbuy?: number ;
    maxbuy?: number;
    dexRouterAddress: string;
    saleAddress: string;
    totalCoinsReceived?: any;
}