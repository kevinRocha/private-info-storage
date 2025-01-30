// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PrivateInfoStorage {
    string private kiiPrivateInfo;
    mapping(address => bool) public whitelist;
    address public owner;

    event AddedToWhitelist(address indexed _address);
    event PrivateInfoUpdated(string _newInfo);

    constructor() {
        owner = msg.sender;

        // Agregar las 10 billeteras a la whitelist
        whitelist[0x5Ec605060d810669fd7134494C4AF17ab438CC92] = true; // Direccion obligatoria
        whitelist[0x3D3A40cba3eF5cC620bC580De1Ed1246CdA7dBa4] = true;
        whitelist[0x7FaC1Ad8D4f84759E64E3F40C9bDe17530C85609] = true;
        whitelist[0x8aC44Dc60C487Fb6CDe46a3C807eAb349Fa98537] = true;
        whitelist[0xA9C18Dc07f70d76C9E5fA431A1f5d23EaF1eF6B4] = true;
        whitelist[0xF3A8473d6Dc4Ed0a3F09772fF7b9bF4231Ef337E] = true;
        whitelist[0x9CbD9C658789fEaFb4Cc7d9261485eB3e36EABc5] = true;
        whitelist[0x2Eac9D76C9F92Ae60c06C32FeE3e6f1Abd7C5F33] = true;
        whitelist[0x8FbCd403Bf4bE1eCc39c4C3A5d61b7eE5B31f435] = true;
        whitelist[0x6Ac1b7fAc78477dCaDb7F86Aa7D4C45Ee2e6472B] = true;
        whitelist[0x4Af7B73dC5c67E5AfCD37Bc3c1Bc47F3Cd96B758] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "No eres el propietario del contrato");
        _;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "No estas en la whitelist");
        _;
    }

    function addToWhitelist(address _address) public onlyOwner {
        require(_address != address(0), "Direccion invalida");
        require(!whitelist[_address], "La direccion ya esta en la whitelist");
        whitelist[_address] = true;
        emit AddedToWhitelist(_address);
    }

    function setPrivateInfo(string memory _info) public onlyOwner {
        require(bytes(_info).length <= 256, "La informacion es demasiado larga");
        kiiPrivateInfo = _info;
        emit PrivateInfoUpdated(_info);
    }

    function getPrivateInfo() public view onlyWhitelisted returns (string memory) {
        return kiiPrivateInfo;
    }
}