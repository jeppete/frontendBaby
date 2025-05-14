import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaby, faXmark } from '@fortawesome/free-solid-svg-icons';
import { VideoFeed } from '../components/VideoFeed';

const backendIp = import.meta.env.VITE_REACT_APP_BACKEND_IP;

const Trening = () => {
  const [modelProba, setModelProba] = useState<number | null>(null);
  const [bodyFound, setBodyFound] = useState<boolean>(false);
  const [retraining, setRetraining] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://${backendIp}/getClassificationProbabilities`);
        const [presentProba, , , bodyFoundStr] = (await res.text()).split(',');
        setModelProba(parseFloat(presentProba));
        setBodyFound(bodyFoundStr.toLowerCase() === 'true');
      } catch (err) {
        console.error('Failed to fetch model probability', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sendRetrainingRequest = async (label: 'baby' | 'no_baby') => {
    if (retraining) return;
    setRetraining(true);
    await fetch(`http://${backendIp}/retrainWithNewSample/${label}`);
    setRetraining(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const confidenceText = modelProba !== null ? `${Math.round(modelProba * 100)}% sikker` : 'Laster...';

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Tren modellen</h1>

      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md border">
        <VideoFeed />
      </div>

      <div className="text-center">
        <p className="text-lg font-medium">Er babyen i sengen nå?</p>
        <p className="text-sm text-gray-500">{confidenceText}</p>

        <div className="flex justify-center gap-10 mt-4">
          <button
            onClick={() => sendRetrainingRequest('baby')}
            disabled={bodyFound || retraining}
            className="flex flex-col items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faBaby} size="2x" />
            <span>Ja</span>
          </button>

          <button
            onClick={() => sendRetrainingRequest('no_baby')}
            disabled={bodyFound || retraining}
            className="flex flex-col items-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faXmark} size="2x" />
            <span>Nei</span>
          </button>
        </div>

        {retraining && (
          <div className="mt-6 flex flex-col items-center">
            <ProgressBar height="80" width="80" borderColor="orange" barColor="steelblue" />
            <p className="text-sm mt-2">Trener modellen...</p>
          </div>
        )}

        {success && (
          <div className="mt-4 text-green-600 font-medium">
            ✅ Treningsdata lagret
          </div>
        )}
      </div>
    </div>
  );
};

export default Trening;
