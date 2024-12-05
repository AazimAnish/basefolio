"use client";

import React, { useState } from "react";
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from "~~/hooks/useToast";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useAccount } from 'wagmi';

interface Platform {
  platform: string;
  username: string;
  verified: boolean;
}

interface FormData {
  name: string;
  email: string;
  github: string;
  codechef: string;
  linkedin: string;
}

interface Portfolio {
  name: string;
  email: string;
  githubUsername: string;
  codeChefUsername: string;
  linkedInProfile: string;
}

const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID || '';
const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET || '';
const PROVIDER_IDS: Record<string, string> = {
  github: process.env.NEXT_PUBLIC_GITHUB_PROVIDER_PROFILE_DATA || '',
  codechef: process.env.NEXT_PUBLIC_CODECHEF_PROVIDER_RANKING || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_IMPRESSIONS || ''
};

export default function PortfolioForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    github: "",
    codechef: "",
    linkedin: ""
  });
  const [verifiedPlatforms, setVerifiedPlatforms] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [currentPlatform, setCurrentPlatform] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTokenId, setSelectedTokenId] = useState<number>(1);
  const [showPortfolio, setShowPortfolio] = useState<boolean>(false);
  const { toast } = useToast();
  const { writeContractAsync } = useScaffoldWriteContract("YourContract");
  const { address } = useAccount();

  const { data: totalPortfolios } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "totalPortfolios",
  });

  const { data: portfolioData } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getPortfolio",
    args: [BigInt(selectedTokenId)],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTokenIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= Number(totalPortfolios)) {
      setSelectedTokenId(value);
    }
  };

  const initializeReclaim = async (platform: string): Promise<boolean> => {
    try {
      const providerId = PROVIDER_IDS[platform];
      if (!providerId) {
        throw new Error(`No provider ID found for ${platform}`);
      }

      const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, providerId);
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      setQrCodeUrl(requestUrl);

      await reclaimProofRequest.startSession({
        onSuccess: (proofs: any) => {
          let verifiedValue = '';
          try {
            const context = JSON.parse(proofs.claimData.context);
            const extractedParams = context.extractedParameters;

            switch(platform) {
              case 'github':
                verifiedValue = extractedParams.username || '';
                break;
              case 'codechef':
                verifiedValue = extractedParams.username || '';
                break;
              case 'linkedin':
                verifiedValue = extractedParams.profileUrl || '';
                break;
            }

            setFormData(prev => ({
              ...prev,
              [platform]: verifiedValue
            }));
          } catch (error) {
            console.error('Error parsing proof data:', error);
          }

          setVerifiedPlatforms(prev => new Set([...prev, platform]));
          setIsModalOpen(false);
          setQrCodeUrl('');
          toast({
            title: "Verification Successful",
            description: `Your ${platform} account has been verified.`,
            variant: "success"
          });
          return true;
        },
        onError: (error: Error) => {
          setIsModalOpen(false);
          setQrCodeUrl('');
          toast({
            title: "Verification Failed",
            description: error.message,
            variant: "destructive"
          });
          return false;
        }
      });

      return true;
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: "Verification Error",
        description: "An error occurred during verification.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleVerify = async (platform: string) => {
    setCurrentPlatform(platform);
    setIsModalOpen(true);
    await initializeReclaim(platform);
  };

  const mintNFT = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your name and email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const tx = await writeContractAsync({
        functionName: "mintPortfolio",
        args: [
          address,
          formData.name,
          formData.email,
          formData.github || "",
          formData.codechef || "",
          formData.linkedin || ""
        ],
      });

      toast({
        title: "Success",
        description: "Portfolio NFT minted successfully!",
        variant: "success"
      });

      // Reset form after successful mint
      setFormData({
        name: "",
        email: "",
        github: "",
        codechef: "",
        linkedin: ""
      });
      setVerifiedPlatforms(new Set());

    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6">Create Your Portfolio</h2>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              id="name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {Object.keys(PROVIDER_IDS).map((platform) => (
            <div key={platform} className="form-control">
              <label className="label">
                <span className="label-text capitalize">{platform} Username (Optional)</span>
                <button 
                  className={`btn btn-sm ${verifiedPlatforms.has(platform) ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => handleVerify(platform)}
                >
                  {verifiedPlatforms.has(platform) ? 'Verified ✓' : 'Verify with Reclaim'}
                </button>
              </label>
              <input
                type="text"
                id={platform}
                className={`input input-bordered ${verifiedPlatforms.has(platform) ? 'input-success' : ''}`}
                value={formData[platform as keyof FormData]}
                onChange={handleInputChange}
                readOnly={verifiedPlatforms.has(platform)}
              />
            </div>
          ))}

          <div className="card-actions justify-end mt-6 space-x-2">
            <button 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              onClick={mintNFT}
              disabled={isLoading || !formData.name || !formData.email}
            >
              Mint NFT
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowPortfolio(!showPortfolio)}
            >
              {showPortfolio ? 'Hide NFTs' : 'View NFTs'}
            </button>
          </div>

          {showPortfolio && (
            <div className="mt-6 p-4 bg-base-300 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">View Portfolio NFTs</h3>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="number"
                  min="1"
                  max={Number(totalPortfolios)}
                  value={selectedTokenId}
                  onChange={handleTokenIdChange}
                  className="input input-bordered w-24"
                />
                <span className="text-sm opacity-75">
                  Total NFTs: {totalPortfolios?.toString() || '0'}
                </span>
              </div>
              
              {portfolioData && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {(portfolioData as Portfolio).name}</p>
                  <p><strong>Email:</strong> {(portfolioData as Portfolio).email}</p>
                  <p><strong>GitHub:</strong> {(portfolioData as Portfolio).githubUsername || 'Not provided'}</p>
                  <p><strong>CodeChef:</strong> {(portfolioData as Portfolio).codeChefUsername || 'Not provided'}</p>
                  <p><strong>LinkedIn:</strong> {(portfolioData as Portfolio).linkedInProfile || 'Not provided'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Verify with Reclaim</h3>
          <div className="flex justify-center mb-6">
            {qrCodeUrl && <QRCodeSVG value={qrCodeUrl} size={256} />}
          </div>
          <p className="text-sm opacity-75 text-center mb-4">
            Scan the QR code with your mobile device to verify your {currentPlatform} account
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
        <div className="modal-backdrop"></div>
      </dialog>
    </div>
  );
}
