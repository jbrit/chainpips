// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDP is ERC20 {
    constructor(uint256 initialSupply) ERC20("USDP", "USDP") {
        _mint(msg.sender, initialSupply);
    }

    // public mint function
    function mintTokens(uint256 amount) public{
        _mint(msg.sender, amount);
    }
}