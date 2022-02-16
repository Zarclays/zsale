/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IDexFactory, IDexFactoryInterface } from "../IDexFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "token1",
        type: "address",
      },
    ],
    name: "getPair",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IDexFactory__factory {
  static readonly abi = _abi;
  static createInterface(): IDexFactoryInterface {
    return new utils.Interface(_abi) as IDexFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDexFactory {
    return new Contract(address, _abi, signerOrProvider) as IDexFactory;
  }
}
