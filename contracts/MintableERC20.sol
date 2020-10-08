  
// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./IMintableERC20.sol";

contract MintableERC20 is IMintableERC20, ERC20, Ownable {

    using SafeMath for uint256;

    constructor (
        string memory name, 
        string memory symbol, 
        uint256 totalSupply,
        uint8 decimals
    ) public ERC20(name, symbol) {
        _setupDecimals(decimals);
        _mint(msg.sender, totalSupply);
    }

    function mint(address account, uint256 amount) external override onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external override onlyOwner {
        _burn(account, amount);
    }
}