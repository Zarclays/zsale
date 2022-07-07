import { ethers } from "hardhat";

export async function advanceTimeTo(newTimeStampInSecond: number){
    await ethers.provider.send("evm_mine", [newTimeStampInSecond]);

    // await ethers.provider.send('evm_setNextBlockTimestamp', [newTimeStampInSecond]); 
    // await ethers.provider.send('evm_mine');
}

export async function takeSnapshot(){
    const snapShotId = await ethers.provider.send("evm_snapshot", []);
    return snapShotId;
}

export async function revertToSnapshot(snapShotId: any){
    await ethers.provider.send("evm_revert", [snapShotId]);
    
}

export async function getCurrentBlock() {
    const currentBlock = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());
    return currentBlock;
}

export async function getCurrentBlockTimeStamp() {
    const currentBlock = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());
    let stamp: number = currentBlock.timestamp;
    return stamp;
}