// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// Defines a simple contract.
contract MyFriends is Ownable {
    event NewFriend(uint i, Friend friend);
    event RemoveFriend(Friend friend);

    struct Friend {
        address account;
        string name;
        string mail;
        string url;
    }

    Friend[] private friends;

    function getFriends() onlyOwner public view returns (Friend[] memory) {
        return friends;
    }

    function getFriend(uint i) onlyOwner public view returns (Friend memory) {
        return friends[i];
    }

    function addFriend(address friend, string memory name, string memory mail, string memory url) public returns (bool) {
        Friend memory newFriend = Friend(friend, name, mail, url);
        friends.push(newFriend);
        emit NewFriend(friends.length, newFriend);
        return true;
    }

    function removeFriend(uint i) public returns (bool) {
        Friend memory friend = friends[i];
        delete friends[i];
        emit RemoveFriend(friend);
        return true;
    }
}
