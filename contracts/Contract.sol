// SPDX-License-Identifier: None
pragma solidity >=0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// Defines `Contract` contract.
contract Contract is Ownable {
    event WriteValue(address owner, uint256 i);
    event EraseValue(address owner, uint256 i);

    mapping(address => string[]) private values;

    function getValues(address author) public view returns (string[] memory) {
        return values[author];
    }

    // @dev Make this payable later.
    function writeValue(string memory text) public returns (uint256) {
        values[msg.sender].push(text);
        uint256 i = values[msg.sender].length;
        emit WriteValue(msg.sender, i);
        return i;
    }

    function eraseValue(uint256 i) public returns (bool) {
        delete values[msg.sender][i];
        emit EraseValue(msg.sender, i);
        return true;
    }
}
