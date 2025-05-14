import { useEffect, useState } from 'react';
import { useSettings } from '../context/SettingsContext';


const backendIp = import.meta.env.VITE_REACT_APP_BACKEND_IP;
const resourceIP = import.meta.env.VITE_REACT_APP_RESOURCE_SERVER_IP;

const formatDuration = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}t ${m}min`;
};

type SleepRow = { awake: boolean; timestamp: number };
type SleepSession = [Date, Date];

const isNightTime = (date: Date, nightStart: number, nightEnd: number): boolean => {
  const hour = date.getHours();
  return nightStart < nightEnd
    ? hour >= nightStart && hour < nightEnd
    : hour >= nightStart || hour < nightEnd;
};

const toSleepSessions = (rows: SleepRow[]): SleepSession[] => {
  const sessions: SleepSession[] = [];
  for (let i = 0; i < rows.length - 1; i++) {
    const current = rows[i];
    const next = rows[i + 1];
    if (!current.awake && next.awake) {
      sessions.push([new Date(current.timestamp), new Date(next.timestamp)]);
    }
  }
  return sessions;
};

const calculateSleepStats = (
  sessions: SleepSession[],
  nightStart: number,
  nightEnd: number,
  now: Date
) => {
  let totalSleepNight = 0;
  let totalSleepDay = 0;

  const clone = (d: Date) => new Date(d.getTime());

  const getWindow = (base: Date, startHour: number, endHour: number) => {
    const start = new Date(base);
    const end = new Date(base);
    start.setHours(startHour, 0, 0, 0);
    end.setHours(endHour, 0, 0, 0);
    if (end <= start) end.setDate(end.getDate() + 1);
    return [start, end] as [Date, Date];
  };

  // Determine current day or night mode
  const isNight = isNightTime(now, nightStart, nightEnd);

  let nightStartTime: Date, nightEndTime: Date;
  let dayStartTime: Date, dayEndTime: Date;

    if (isNight) {
    // currently night: show today's day and tonight's night
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    [nightStartTime, nightEndTime] = getWindow(today, nightStart, nightEnd);
    if (now < nightStartTime) {
      // we're in early morning before nightStart; shift night to yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      [nightStartTime, nightEndTime] = getWindow(yesterday, nightStart, nightEnd);

      // 🧠 Also shift day to *yesterday* if it's still early
      [dayStartTime, dayEndTime] = getWindow(yesterday, nightEnd, nightStart);
    } else {
      // normal night case, use today's day
      [dayStartTime, dayEndTime] = getWindow(today, nightEnd, nightStart);
    }
  }
 else {
    // currently day: show last night's night and today's day
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    [nightStartTime, nightEndTime] = getWindow(yesterday, nightStart, nightEnd);
    [dayStartTime, dayEndTime] = getWindow(today, nightEnd, nightStart);
  }

  for (const [start, end] of sessions) {
    const sessionStart = start;
    const sessionEnd = end > now ? now : end;

    totalSleepNight += getOverlap(sessionStart, sessionEnd, nightStartTime, nightEndTime);
    totalSleepDay += getOverlap(sessionStart, sessionEnd, dayStartTime, dayEndTime);
  }

  return { totalSleepNight, totalSleepDay };
};



// Utility: returns milliseconds of overlap between two ranges
const getOverlap = (startA: Date, endA: Date, startB: Date, endB: Date): number => {
  const start = Math.max(startA.getTime(), startB.getTime());
  const end = Math.min(endA.getTime(), endB.getTime());
  return Math.max(0, end - start);
};




const Hjem = () => {
  const [erVåken, setErVåken] = useState<boolean | null>(null);
  const [sidenTidspunkt, setSidenTidspunkt] = useState<string | null>(null);
  //start of night and start of day
  const { nightStart, nightEnd } = useSettings();
  const [sleepStats, setSleepStats] = useState<{
    totalSleepDay: number;
    totalSleepNight: number;
    totalSleep: number;
  } | null>(null);

  useEffect(() => {
    const fetchAwakeStatus = async () => {
      try {
        const res = await fetch(`http://${resourceIP}/sleep_logs.csv`);
        const text = await res.text();
        const lines = text.trim().split('\n').slice(1); // fjern header
        const rows = lines.map(line => {
          const [awakeStr, timestampStr] = line.split(',');
          return {
            awake: awakeStr === '1',
            timestamp: parseInt(timestampStr) * 1000, // ms
          };
        });

        const lastRow = rows[rows.length - 1];
        setErVåken(lastRow.awake);

        const sisteStatus = [...rows]
          .reverse()
          .find(row => row.awake === lastRow.awake)?.timestamp;

        if (sisteStatus) {
          const tid = new Date(sisteStatus).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          setSidenTidspunkt(tid);
        } else {
          setSidenTidspunkt(null);
        }

        const sessions = toSleepSessions(rows);
        const now = new Date();
        const { totalSleepDay, totalSleepNight } = calculateSleepStats(
        sessions,
        nightStart,
        nightEnd,
        now
        );

        setSleepStats({
        totalSleepDay,
        totalSleepNight,
        totalSleep: totalSleepDay + totalSleepNight,
        });

      } catch (error) {
        console.error('Feil ved henting/parsing:', error);
        setErVåken(null);
        setSidenTidspunkt(null);
        setSleepStats(null);
      }
    };

    fetchAwakeStatus();
    const interval = setInterval(fetchAwakeStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Kort med status */}
      <div className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4 border">
        <img
          src={erVåken === true ? '/vakenIcon.png' : '/sovIcon.png'}
          alt={erVåken === true ? 'August er våken' : 'August sover'}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <div className="text-lg font-semibold">
            {erVåken === null
              ? 'Laster status...'
              : erVåken
              ? 'August er våken'
              : 'August sover'}
          </div>
          {sidenTidspunkt && (
            <div className="text-sm text-gray-500">
              {erVåken
                ? `Har vært våken siden ${sidenTidspunkt}`
                : `Har sovet siden ${sidenTidspunkt}`}
            </div>
          )}
        </div>
      </div>

      {/* Videofeed */}
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md border">
        <img
          src={`http://${backendIp}/video_feed/processed`}
          alt="Videofeed"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Søvnstatistikk */}
      {sleepStats && (
        <div className="bg-white shadow-md rounded-xl p-4 border">
          <h2 className="text-lg font-semibold mb-2">Søvn i dag</h2>
          <div className="text-sm text-gray-700">
            <div>🌓 Natt: {formatDuration(sleepStats.totalSleepNight)}</div>
            <div>🌞 Dag: {formatDuration(sleepStats.totalSleepDay)}</div>
            <div>🛌 Totalt: {formatDuration(sleepStats.totalSleep)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hjem;