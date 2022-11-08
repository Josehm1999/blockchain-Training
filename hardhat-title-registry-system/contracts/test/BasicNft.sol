// SPDX-License-Identifier:MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

pragma solidity ^0.8.7;

contract BasicNft is ERC721 {
    string public constant TOKEN_URI =
        // "ipfs://bafybeid7f734pgufa5ttlws3tokpr4zgwmic2unyf2cabo2inizlpi7wuy/?filename=TituloPrueba.json";
        "ipfs://bafybeiffbgj6ktakzcplqdn3j34ao4f7b555gjlvlfinbfehbvmqc4taue/?filename=TituloPrueba.json";
    uint256 private s_tokenCounter;

    event TitleMinted(uint256 indexed tokenId);

    constructor() ERC721("TitleRegistry", "TITLE_REGISTRY") {
        s_tokenCounter = 0;
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
        return s_tokenCounter;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
