// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./ERC721Tradable.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";

contract Creature is TradeableERC721Token {
    constructor (address _proxyRegistryAddress) TradeableERC721Token ("Creature" , "OSC", _proxyRegistryAddress) public {}

    function baseTokenURI() public view returns (string memory) {
        return "https://opensea-creatures-api.herokuapp.com/api/creature/";
    }
}
