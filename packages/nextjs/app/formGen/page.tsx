"use client";

import React, { useState, useEffect } from "react";
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from "~~/hooks/useToast";

const platforms = ["LinkedIn", "Twitter", "CodeChef", "LeetCode"];

interface Platform {
  platform: string;
  username: string;
  verified: boolean;
}

interface FormData {
  name: string;
  email: string;
  platforms: Platform[];
}

const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID || '';
const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET || '';
const PROVIDER_IDS: Record<string, string> = {
  github: process.env.NEXT_PUBLIC_GITHUB_PROVIDER || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_PROVIDER || '',
  twitter: process.env.NEXT_PUBLIC_TWITTER_PROVIDER || '',
  codechef: process.env.NEXT_PUBLIC_CODECHEF_PROVIDER || '',
  leetcode: process.env.NEXT_PUBLIC_LEETCODE_PROVIDER || ''
};

export default function PortfolioForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [platformCards, setPlatformCards] = useState<string[]>([]);
  const [verifiedPlatforms, setVerifiedPlatforms] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<FormData | null>(null);
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState<number>(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [currentPlatform, setCurrentPlatform] = useState<string>('');
  const { toast } = useToast();

  const canGeneratePortfolio = name && email && verifiedPlatforms.has("github");

  const initializeReclaim = async (platform: string, username: string): Promise<boolean> => {
    try {
      const providerId = PROVIDER_IDS[platform.toLowerCase()];
      if (!providerId) {
        throw new Error(`No provider ID found for ${platform}`);
      }

      const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, providerId);
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      setQrCodeUrl(requestUrl);

      await reclaimProofRequest.startSession({
        onSuccess: (proofs: any) => {
          console.log('Reclaim return data:', proofs);
          setVerifiedPlatforms(prev => new Set([...prev, platform.toLowerCase()]));
          setIsModalOpen(false);
          toast({
            title: "Verification Successful",
            description: `Your ${platform} account has been verified.`,
            type: "success"
          });
          return true;
        },
        onError: (error: Error) => {
          console.error('Verification failed:', error);
          setIsModalOpen(false);
          toast({
            title: "Verification Failed",
            description: error.message || "An error occurred during verification.",
            type: "error"
          });
          return false;
        }
      });

      return true;
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        type: "error"
      });
      return false;
    }
  };

  const handleVerify = async (platform: string, username: string): Promise<void> => {
    setCurrentPlatform(platform);
    setIsModalOpen(true);
    await initializeReclaim(platform, username);
  };

  const addPlatformCard = (): void => {
    if (currentPlatformIndex >= platforms.length) return;
    const platform = platforms[currentPlatformIndex];
    setPlatformCards((prev) => [...prev, platform]);
    setCurrentPlatformIndex((prev) => prev + 1);
  };

  const generatePortfolio = (): void => {
    const githubInput = document.querySelector('[data-platform="github"]') as HTMLInputElement;
    
    const formData: FormData = {
      name,
      email,
      platforms: [
        {
          platform: "github",
          username: githubInput.value,
          verified: verifiedPlatforms.has("github"),
        },
        ...platformCards.map((platform) => {
          const input = document.querySelector(
            `[data-platform="${platform.toLowerCase()}"]`
          ) as HTMLInputElement;
          return {
            platform: platform.toLowerCase(),
            username: input.value,
            verified: verifiedPlatforms.has(platform.toLowerCase()),
          };
        }),
      ],
    };
    setPreviewData(formData);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-base-100 p-6 rounded-lg border-2 border-neutral shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-neutral">Portfolio Form</h1>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <label className="label">
                      <span className="label-text">GitHub Username</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      data-platform="github"
                      placeholder="Enter GitHub username"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const input = document.querySelector('[data-platform="github"]') as HTMLInputElement;
                      handleVerify("github", input.value);
                    }}
                  >
                    Prove with Reclaim
                  </button>
                </div>
                {verifiedPlatforms.has("github") && (
                  <div className="mt-2 text-success flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                )}
              </div>
            </div>

            {platformCards.map((platform, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <label className="label">
                        <span className="label-text">{platform} Username</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        data-platform={platform.toLowerCase()}
                        placeholder={`Enter ${platform} username`}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const input = document.querySelector(
                          `[data-platform="${platform.toLowerCase()}"]`
                        ) as HTMLInputElement;
                        handleVerify(platform.toLowerCase(), input.value);
                      }}
                    >
                      Prove with Reclaim
                    </button>
                  </div>
                  {verifiedPlatforms.has(platform.toLowerCase()) && (
                    <div className="mt-2 text-success flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={addPlatformCard}>Add Platform</button>

          <button
            className="btn btn-primary w-full"
            disabled={!canGeneratePortfolio}
            onClick={generatePortfolio}
          >
            Generate Portfolio
          </button>
        </div>

        {previewData && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(previewData, null, 2)}
            </pre>
          </div>
        )}

        <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Verify with Reclaim</h3>
            <div className="flex justify-center mb-4">
              {qrCodeUrl && <QRCodeSVG value={qrCodeUrl} size={256} />}
            </div>
            <p className="text-sm text-base-content opacity-60 mb-4">
              Scan the QR code with your mobile device to verify your {currentPlatform} account
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
