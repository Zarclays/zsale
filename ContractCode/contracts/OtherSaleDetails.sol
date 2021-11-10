// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

// This is where to store other details like SaleTime, WhiteList e.t.c.
contract OtherSaleDetails{

    uint256 public saleStartTime;
    uint256 public saleEndTime;
    uint256 public SoftCap;
    uint256 public HardCap;
    bool public WhitelistEnabled;

    address[] private whitelist;


    function getDetails(uint256 _saleStartTime, uint256 _saleEndTime, uint256 _SoftCap, uint256 _HardCap, bool _WhiteListEnable) public {
        saleStartTime = _saleStartTime;
        saleEndTime = _saleEndTime;
        SoftCap = _SoftCap;
        HardCap = _HardCap;
        WhitelistEnabled = _WhiteListEnable;
    }

}