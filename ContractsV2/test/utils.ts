import { ethers } from "hardhat";

export async function advanceTimeTo(newTimeStampInSecond: number){
    await ethers.provider.send("evm_mine", [newTimeStampInSecond]);

    // await ethers.provider.send('evm_setNextBlockTimestamp', [newTimeStampInSecond]); 
    // await ethers.provider.send('evm_mine');
}