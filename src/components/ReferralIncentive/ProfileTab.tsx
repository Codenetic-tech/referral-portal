// ProfileTab.tsx
import React, { useState } from 'react';
import { Share2, Link, Copy, Check, Smartphone, Globe, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileTabProps {
  loading: boolean;
}

interface ShortLinkResponse {
  status: number;
  reason: string;
  shortLink: string;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ loading }) => {
  const { user } = useAuth();
  const [selectedSource, setSelectedSource] = useState('WHATSAPP');
  const [campaignTag, setCampaignTag] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socialMediaSources = [
    { id: 'WHATSAPP', name: 'WhatsApp', icon: '💬' },
    { id: 'FACEBOOK', name: 'Facebook', icon: '📘' },
    { id: 'INSTAGRAM', name: 'Instagram', icon: '📷' },
    { id: 'TWITTER', name: 'Twitter', icon: '🐦' },
    { id: 'LINKEDIN', name: 'LinkedIn', icon: '💼' },
    { id: 'TELEGRAM', name: 'Telegram', icon: '✈️' },
    { id: 'SMS', name: 'SMS', icon: '📱' },
    { id: 'EMAIL', name: 'Email', icon: '📧' },
    { id: 'OTHER', name: 'Other', icon: '🔗' },
  ];

  const generateReferralLink = async () => {
    if (!user?.clientid) {
      setError('User not found. Please try again.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const longLink = `https://www.gopocket.in/open-account-call-back?refer=${user.clientid}&src=${selectedSource}&tag=${encodeURIComponent(campaignTag)}`;
      
      // Send to webhook to get short link
      const response = await fetch('https://n8n.gopocket.in/webhook/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'referral',
          link: longLink,
          clientid: user.clientid,
          token: user.token
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate short link');
      }

      const data: ShortLinkResponse[] = await response.json();
      
      if (data && data[0] && data[0].status === 1) {
        setShortLink(data[0].shortLink);
      } else {
        throw new Error(data[0]?.reason || 'Failed to generate short link');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while generating the link';
      setError(errorMessage);
      console.error('Error generating referral link:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortLink) return;
    
    try {
      await navigator.clipboard.writeText(shortLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy to clipboard');
    }
  };

  const handleMobileShare = async () => {
    if (!shortLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Open Your Pocket Trading Account',
          text: 'Join me on Pocket Trading and start your investment journey!',
          url: shortLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        // Fallback to copy if share is cancelled or fails
        copyToClipboard();
      }
    } else {
      // Fallback to copy if Web Share API is not supported
      copyToClipboard();
    }
  };

  const openLink = () => {
    if (shortLink) {
      window.open(shortLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Share2 className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Generate Referral Link</h2>
        </div>
        <p className="text-gray-600">
          Create personalized referral links to share on social media and track your campaign performance.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <span className="text-sm font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Your Link</h3>
          
          {/* Social Media Source Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Platform
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
              {socialMediaSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSource === source.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{source.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{source.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Tag Input */}
          <div className="mb-6">
            <label htmlFor="campaignTag" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name (Optional)
            </label>
            <input
              type="text"
              id="campaignTag"
              placeholder="Enter campaign name for tracking"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={campaignTag}
              onChange={(e) => setCampaignTag(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps you track performance for different campaigns
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateReferralLink}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            <Link size={20} />
            {isGenerating ? 'Generating Short Link...' : 'Generate Referral Link'}
          </button>
        </div>

        {/* Right Column - Generated Link */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
          
          {shortLink ? (
            <div className="space-y-4">
              {/* Short Link Display */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-600 mb-2 font-medium">Your Shareable Link:</div>
                <div className="text-green-700 font-medium break-all flex items-center gap-2 justify-between">
                  <span className="flex-1">{shortLink}</span>
                  <button
                    onClick={openLink}
                    className="text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                    title="Open link"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Copy Short Link Button */}
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isCopied ? <Check size={20} /> : <Copy size={20} />}
                  <span className="hidden sm:inline">
                    {isCopied ? 'Copied!' : 'Copy Link'}
                  </span>
                  <span className="sm:hidden">Copy</span>
                </button>

                {/* Mobile Share Button */}
                <button
                  onClick={handleMobileShare}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 sm:hidden"
                >
                  <Smartphone size={20} />
                  Share
                </button>

                {/* Desktop Share Info */}
                <div className="hidden sm:flex flex-1 items-center justify-center gap-2 text-gray-500">
                  <Globe size={20} />
                  <span className="text-sm">Ready to share</span>
                </div>
              </div>

              {/* Mobile Instructions */}
              <div className="sm:hidden bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 mb-1">
                  <Smartphone size={16} />
                  <span className="text-sm font-medium">Mobile Sharing</span>
                </div>
                <p className="text-xs text-blue-700">
                  Tap "Share" to open sharing options and send via WhatsApp, Messages, or other apps.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Link className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">Generate a referral link to get started</p>
              <p className="text-gray-400 text-sm mt-1">You'll receive a short, shareable link</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics & Tips */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sharing Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">💡</div>
            <div>
              <h4 className="font-medium text-gray-900">Best Practices</h4>
              <p className="text-sm text-gray-600">Share personalized messages with your link for better conversion.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">📊</div>
            <div>
              <h4 className="font-medium text-gray-900">Track Performance</h4>
              <p className="text-sm text-gray-600">Use different campaign names to track which sources perform best.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">🔗</div>
            <div>
              <h4 className="font-medium text-gray-900">Short Links</h4>
              <p className="text-sm text-gray-600">We provide short links that are easier to share and track.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">📱</div>
            <div>
              <h4 className="font-medium text-gray-900">Mobile Sharing</h4>
              <p className="text-sm text-gray-600">Use the Share button on mobile to quickly send to your contacts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;