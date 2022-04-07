// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract Initializable {
    bool inited = false;

    modifier initializer() {
        require(!inited, "already inited");
        _;
        inited = true;
    }
}
