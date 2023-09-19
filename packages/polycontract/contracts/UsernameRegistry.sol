// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

pragma solidity ^0.8.0;

//Allows people to associate their address with an OpenPredict username and IPFS url.
contract UsernameRegistry {
    struct User {
        address owner;
        bytes ipfsUrl;
    }

    mapping(string => User) private usernames;

    event UsernameRegistered(string username, address owner, bytes ipfsUrl);

    function registerUsername(string memory username, bytes memory ipfsUrl) public {
        require(usernames[username].owner == address(0), "Username already taken");
        require(bytes(username).length > 0, "Username cannot be empty");
        require(bytes(username).length <= 32, "Username must be less than or equal to 32 characters");
        require(isAlphanumeric(username), "Username must be alphanumeric");

        usernames[username] = User(msg.sender, ipfsUrl);

        emit UsernameRegistered(username, msg.sender, ipfsUrl);
    }

    function setUsernameIPFSUrl(string memory username, bytes memory ipfsUrl) public {
        require(usernames[username].owner == msg.sender, "Only the owner can set the IPFS URL");
        usernames[username].ipfsUrl = ipfsUrl;
    }

    function getUsernameOwner(string memory username) public view returns (address) {
        return usernames[username].owner;
    }

    function getUsernameIPFSUrl(string memory username) public view returns (bytes memory) {
        return usernames[username].ipfsUrl;
    }

    function isAlphanumeric(string memory str) internal pure returns (bool) {
        bytes memory b = bytes(str);
        for (uint256 i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            if (
                !(char >= 0x30 && char <= 0x39) && // 0-9
                !(char >= 0x41 && char <= 0x5A) && // A-Z
                !(char >= 0x61 && char <= 0x7A)    // a-z
            ) {
                return false;
            }
        }
        return true;
    }
}
