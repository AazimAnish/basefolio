//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract YourContract is ERC721Enumerable {
    // Portfolio Struct
    struct Portfolio {
        string name;
        string email;
        string githubUsername;
        string codeChefUsername;
        string linkedInProfile;
    }

    // State Variables
    address public immutable owner;
    mapping(uint256 => Portfolio) private portfolios;
    uint256 public totalPortfolios = 0;

    // Events
    event PortfolioMinted(
        address indexed creator, 
        uint256 tokenId, 
        string name
    );

    constructor(address _owner) ERC721("PortfolioNFT", "PFNFT") {
        owner = _owner;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    function mintPortfolio(
        address _to,
        string memory _name,
        string memory _email,
        string memory _githubUsername,
        string memory _codeChefUsername,
        string memory _linkedInProfile
    ) public returns (uint256) {
        totalPortfolios++;
        
        _safeMint(_to, totalPortfolios);

        portfolios[totalPortfolios] = Portfolio({
            name: _name,
            email: _email,
            githubUsername: _githubUsername,
            codeChefUsername: _codeChefUsername,
            linkedInProfile: _linkedInProfile
        });

        emit PortfolioMinted(msg.sender, totalPortfolios, _name);
        return totalPortfolios;
    }

    function getPortfolio(uint256 _tokenId) public view returns (Portfolio memory) {
        require(_tokenId > 0 && _tokenId <= totalPortfolios, "Portfolio does not exist");
        return portfolios[_tokenId];
    }

    function withdraw() public isOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }

    receive() external payable {}
}