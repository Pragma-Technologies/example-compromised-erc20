  
// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMintableERC20.sol";

contract MintableERC20 is ERC20, Ownable {

    event MaintainerAdded(address maintainer);
    event MaintainerRemoved(address maintainer);

    address[] private _maintainers;

    constructor (
        string memory name, 
        string memory symbol, 
        uint256 totalSupply,
        uint8 decimals
    ) public ERC20(name, symbol) {
        _setupDecimals(decimals);
        _mint(msg.sender, totalSupply);
    }

    function mintAmount(address[] calldata accounts, uint256 amount) external onlyMaintainers {
        for (uint i = 0; i < accounts.length; ++i) {
            _mint(accounts[i], amount);
        }
    }

    function mintAmounts(address[] calldata accounts, uint256[] calldata amounts) external onlyMaintainers {
        require(accounts.length == amounts.length, "MintableERC20: invalid length");
        for (uint i = 0; i < accounts.length; ++i) {
            _mint(accounts[i], amounts[i]);
        }
    }

    function addMaintainer(address maintainer) external onlyOwner {
        if (_isMaintainer(maintainer)) {
            revert("MintableERC20: maintainer exists");
        }
        _maintainers.push(maintainer);
        emit MaintainerAdded(maintainer);
    }

    function removeMaintainer(address maintainer) external onlyOwner {
        for (uint i = 0; i < _maintainers.length; ++i) {
            if (_maintainers[i] == maintainer) {
                _maintainers[i] = _maintainers[_maintainers.length - 1];
                _maintainers.pop();
                emit MaintainerRemoved(maintainer);
                return;
            }
        }
        revert("MintableERC20: maintainer not found");
    }

    function maintainers() external view returns (address[] memory) {
        return _maintainers;
    }

    function _isMaintainer(address maintaner) private view returns (bool) {
        if (maintaner == owner()) {
            return true;
        }
        for (uint i = 0; i < _maintainers.length; ++i) {
            if (_maintainers[i] == maintaner) {
                return true;
            }
        }
        return false;
    }

    modifier onlyMaintainers() {
        require(_isMaintainer(msg.sender), "MintableERC20: permission denied");
        _;
    }
}