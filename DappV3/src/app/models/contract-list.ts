
export interface ContractListArray {
    [index: number]: {
        chainId: number,
        campaignList: string,
        
        routers: {name: string,address: string}[]
    };
}

const contractList: ContractListArray =  {
    1: {
        chainId: 1,
        campaignList: '0x',
        
        routers:[
            {
                name: 'Swap',
                address: '0xb2869F895FC24790e81EF05a3AeF0F23897eC33b'
            }
        ]
    },
    97: {
        chainId: 97,
        campaignList: '0xb2869F895FC24790e81EF05a3AeF0F23897eC33b',
        
        routers:[
            {
                name: 'Swap',
                address: '0xb2869F895FC24790e81EF05a3AeF0F23897eC33b'
            }
        ]
    },
    31337: {// Hardhat test
        chainId: 31337,
        campaignList: '0x9Fcca440F19c62CDF7f973eB6DDF218B15d4C71D',        
        routers:[
            {
                name: 'Swap',
                address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' //'0xb2869F895FC24790e81EF05a3AeF0F23897eC33b'
            }
        ]
    }, 
    82: {// Meter
        chainId: 83,
        campaignList: '0xc4cc045f934f8bD03A333fCEd331fBf8D26d9931',        
        routers:[
            {
                name: 'Swap',
                address: '0xb2869F895FC24790e81EF05a3AeF0F23897eC33b'
            }
        ]
    },

    83: {// Meter test
        chainId: 83,
        campaignList: '0x7eB3F9e8f142CeF7867d6c8b1B57AAc4aBc99b6F',       
        routers:[
            {
                name: 'Swap',
                address: '0xb2869F895FC24790e81EF05a3AeF0F23897eC33b'
            }
        ]
    },
    

    1313161555: { //Aurora testnet
        chainId: 1313161555,
        campaignList: '0x742489F22807ebB4C36ca6cD95c3e1C044B7B6c8',        
        routers:[
            {
                name: 'Swap',
                address: '0xb2869F895FC24790e81EF05a3AeF0F23897eC33b'
            }
        ]
    }
    
};

export default contractList;