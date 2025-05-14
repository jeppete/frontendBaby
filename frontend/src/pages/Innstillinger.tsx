import { useSettings } from '../context/SettingsContext';

const Innstillinger = () => {
  const { nightStart, nightEnd, setNightStart, setNightEnd } = useSettings();

  return (
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
  );
};

export default Innstillinger;
