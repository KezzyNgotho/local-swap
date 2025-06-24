import { useEffect, useState } from "react";

const [location, setLocation] = useState(null);
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let country = "US";
        if (longitude < 10 && latitude > 4 && latitude < 14) country = "Nigeria";
        else if (longitude > -2 && latitude > 4 && latitude < 12) country = "Ghana";
        setLocation({ country, latitude, longitude });
      },
      () => setLocation(null)
    );
  } else {
    setLocation(null);
  }
}, []);

const filteredTrades = location && location.country !== 'US'
  ? trades.filter(item => (location.country === 'Nigeria' && item.id.endsWith('1')) || (location.country === 'Ghana' && item.id.endsWith('2')))
  : trades;

<div className="flex items-center gap-2">
  <span className="text-2xl">💱</span>
  <span className="font-bold">Trades</span>
  {location && location.country !== 'US' && (
    <span className="ml-2 text-xs bg-[#176B63] text-white px-2 py-0.5 rounded-lg">{location.country === 'Nigeria' ? '🇳🇬' : location.country === 'Ghana' ? '🇬🇭' : location.country}</span>
  )}
</div> 