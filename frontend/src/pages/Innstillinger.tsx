import { useSettings } from '../context/SettingsContext';
import { VideoFeedCropSettings } from '../components/VideoFeedCropSettings';

const backendIp = import.meta.env.VITE_REACT_APP_BACKEND_IP;

const Innstillinger = () => {
  const { nightStart, nightEnd, setNightStart, setNightEnd, setCropBounds } = useSettings();


  return (
  <>
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Innstillinger</h1>

      <div>
        <label className="block mb-1 font-medium">Når starter natten?</label>
        <select
          value={nightStart}
          onChange={(e) => setNightStart(Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          {Array.from({ length: 8 }, (_, i) => {
            const hour = 16 + i;
            return (
              <option key={hour} value={hour}>
                {`${hour.toString().padStart(2, '0')}:00`}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Når slutter natten?</label>
        <select
          value={nightEnd}
          onChange={(e) => setNightEnd(Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          {Array.from({ length: 8 }, (_, i) => {
            const hour = 4 + i;
            return (
              <option key={hour} value={hour}>
                {`${hour.toString().padStart(2, '0')}:00`}
              </option>
            );
          })}
        </select>
      </div>
    </div>

    <div className="p-4">
      <VideoFeedCropSettings
        videoFeedUrl={`http://${backendIp}/video_feed/raw`}
        onBoundingBoxChange={(bounds) => {
          console.log("Nye grenser:", bounds);
          setCropBounds(bounds);
        }}
      />
    </div>
  </>
);

};

export default Innstillinger;
