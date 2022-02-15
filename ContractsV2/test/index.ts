import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const now = new Date();
    const twoHoursTime = now.setHours(now.getHours()+2);
    const fourHoursLater = now.setHours(now.getHours()+4);

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!", [
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false}
        ]);

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");

    console.log('list: ',await greeter.listMember(1))
  });
});
