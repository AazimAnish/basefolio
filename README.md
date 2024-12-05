Basefolio
=========

**Built at Hyperthon - Speed Coding Competition**\
📅 **Thursday, December 5, 6:00 PM - 9:00 PM**\
📍 **The Den Bengaluru, Bengaluru, Karnataka**

* * * * *


### 🛠️ About Basefolio

**Basefolio** is an NFT-based professional portfolio solution created within **3 hours** during the Hyperthon coding event. It's designed to empower professionals to mint and manage their digital portfolios securely and transparently on the blockchain.

* * * * *

🚀 Project Highlights
---------------------

-   **Zero-Knowledge Proof Integration**: Ensures privacy for sensitive user data while maintaining the authenticity of portfolios.
-   **NFT Minting**: Convert your professional portfolio into a unique, tamper-proof NFT with a verifiable on-chain record.
-   **Reclaim Integration**: Provides secure wallet authentication and uses verifiable credentials for seamless login and data sharing.
-   **Dynamic Metadata Storage**: Links professional details such as GitHub profiles, CodeChef stats, and LinkedIn connections to minted NFTs.

* * * * *

🌟 Built With
-------------

**Tech Stack**:

-   **[eth-scaffold](https://github.com/scaffold-eth/scaffold-eth)**: Modernized Scaffold-ETH featuring Next.js, RainbowKit, Wagmi, and TypeScript, providing a streamlined developer experience.
-   **Hardhat**: Ethereum development environment for compiling, deploying, and testing smart contracts.
-   **Reclaim Protocol**: Integrated for authentication and Zero-Knowledge Proof generation.

* * * * *

💡 Use Cases and Problem Solved
-------------------------------

### Market Loopholes

1.  **Forgery**: Traditional resumes and portfolios can be faked or tampered with.
2.  **Lack of Transparency**: Hiring managers often struggle to verify credentials efficiently.
3.  **Data Privacy**: Users risk exposing sensitive personal information while showcasing their skills.

### Solutions Provided by Basefolio

-   **Immutable Records**: Blockchain-backed NFT portfolios ensure authenticity and traceability.
-   **Privacy with ZKP**: Sensitive data is verified using Zero-Knowledge Proofs, ensuring confidentiality while validating credentials.
-   **Dynamic Updates**: Update your portfolio details seamlessly without losing the integrity of your NFT.

* * * * *

💻 How Basefolio Works
----------------------

### 1\. Portfolio Minting

-   Users submit details like name, email, GitHub, CodeChef, and LinkedIn profiles.
-   The contract mints an NFT representing the user's portfolio, storing metadata on-chain.

### 2\. Reclaim Protocol Integration

-   Utilizes verifiable credentials for wallet-based authentication.
-   Zero-Knowledge Proofs validate user data without exposing sensitive details.

### 3\. Ownership and Transparency

-   Minted NFTs are linked to the user's wallet, ensuring that the portfolio remains secure and tamper-proof.
-   Employers can verify the authenticity of portfolios by checking the NFT metadata on-chain.

* * * * *

🛠️ Features Completed (7 Commits)
----------------------------------

1.  **Contract Deployment**: ERC721-based NFT smart contract for portfolio minting.
2.  **Portfolio Metadata**: Struct to store professional details securely on-chain.
3.  **Minting Functionality**: Secure NFT minting with `_safeMint`.
4.  **Integration with Reclaim Protocol**: Wallet-based authentication with ZKP.
5.  **Frontend Interface**: Built with eth-scaffold (Next.js + Wagmi + RainbowKit).
6.  **Dynamic Metadata Retrieval**: View and update professional details via NFT metadata.
7.  **Testing and Deployment**: Deployed contracts using Hardhat.

* * * * *

🌐 Use Case Example
-------------------

Imagine you're applying for a job and want to showcase your verified achievements:

1.  **Mint Your Portfolio NFT**: Provide details like your GitHub and LinkedIn profiles and mint your portfolio.
2.  **Share Securely**: Use Reclaim Protocol to share your portfolio with potential employers without exposing sensitive data.
3.  **Employers Verify**: Employers verify the NFT on-chain, ensuring the authenticity of your skills and experience.

* * * * *

💡 Future Scope
---------------

1.  **Integration with More Platforms**: Support additional professional platforms like Dribbble, LeetCode, and Kaggle.
2.  **Customizable Portfolios**: Allow users to add multimedia and tailor their portfolio NFTs.
3.  **Analytics Dashboard**: Track NFT interactions and verify statistics for user profiles.
