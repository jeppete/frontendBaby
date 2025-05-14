// components/VideoFeedCropSettings.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Annotorious } from '@recogito/annotorious';
import '@recogito/annotorious/dist/annotorious.min.css';


/**
 * Props:
 * - videoFeedUrl: string URL to the MJPEG video stream
 * - onBoundingBoxChange: callback when a crop box is set/reset
 */
type VideoFeedCropSettingsProps = {
  videoFeedUrl: string;
  onBoundingBoxChange?: (bounds: string | null) => void;
};

export const VideoFeedCropSettings: React.FC<VideoFeedCropSettingsProps> = ({ videoFeedUrl, onBoundingBoxChange }) => {
  const imgEl = useRef<HTMLImageElement | null>(null);
  const [anno, setAnno] = useState<any>(null);
  const [boundingBox, setBoundingBox] = useState<string | null>(null);

  useEffect(() => {
    if (!imgEl.current) return;

    const annotorious = new Annotorious({
      image: imgEl.current,
      disableEditor: true,
      handleRadius: 14
    });

    annotorious.on('createSelection', (annotation: any) => {
      const bounds = annotation.target.selector.value;
      setBoundingBox(bounds);
    });

    annotorious.on('changeSelectionTarget', (annotation: any) => {
      const bounds = annotation.selector.value;
      setBoundingBox(bounds);
      onBoundingBoxChange?.(bounds);
    });

    annotorious.on('cancelSelected', () => {
      setBoundingBox(null);
      onBoundingBoxChange?.(null);
    });

    setAnno(annotorious);
    return () => annotorious.destroy();
  }, [imgEl.current]);

  const handleSet = async () => {
    if (!boundingBox) return;
    const coords = boundingBox.split(':')[1];
    await fetch(`http://${import.meta.env.VITE_REACT_APP_BACKEND_IP}/setAIFocusRegion/${coords}`);

    onBoundingBoxChange?.(boundingBox); // ✅ Store in context only now
    };

  const handleReset = async () => {
    anno?.clearAnnotations();
    setBoundingBox(null);
    onBoundingBoxChange?.(null);
    await fetch(`http://${import.meta.env.VITE_REACT_APP_BACKEND_IP}/setAIFocusRegion/reset`);
  };

  return (
    <div className="space-y-4">
      <img
        ref={imgEl}
        src={videoFeedUrl}
        className="rounded-xl w-full border"
        alt="Crop Target"
      />
      <div className="text-center">
        <p><strong>Marker område for AI-fokus</strong><br /><em>Tips: bare marker soveområdet</em></p>
        <div className="flex justify-center gap-4">
          <button
  onClick={handleSet}
  className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
>
  Lagre
</button>
          <button
  onClick={handleReset}
  className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
>
  Tilbakestill
</button>
        </div>
      </div>
    </div>
  );
};
