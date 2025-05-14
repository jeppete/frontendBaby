import React from 'react';
import { useSettings } from '../context/SettingsContext';

type VideoFeedProps = {
  className?: string;
};

export const VideoFeed: React.FC<VideoFeedProps> = ({ className }) => {
  const { cropBounds } = useSettings();
  const backendIp = import.meta.env.VITE_REACT_APP_BACKEND_IP;

  const videoUrl = cropBounds
    ? `http://${backendIp}/video_feed/processed`
    : `http://${backendIp}/video_feed/raw`;
console.log("🎥 Video URL being used:", videoUrl); // ✅ Safe to log here
  return (
    <img
      src={videoUrl}
      alt="Live video feed"
      className={`w-full h-full object-cover rounded-xl ${className ?? ''}`}
    />
  );
};
