import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, MapPin } from 'lucide-react';

// Fix Leaflet marker icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DeliveryMap = ({ order }) => {
    // Mock simulation of "Live" tracking
    const startPos = [0.5143, 35.2698]; // Eldoret (Surplus)
    const endPos = [1.2921, 36.8219];   // Nairobi (Market)
    const [currentPos, setCurrentPos] = useState(startPos);

    useEffect(() => {
        // Simple linear interpolation animation
        let progress = 0;
        const interval = setInterval(() => {
            progress += 0.01;
            if (progress > 1) progress = 0; // Loop

            const lat = startPos[0] + (endPos[0] - startPos[0]) * progress;
            const lng = startPos[1] + (endPos[1] - startPos[1]) * progress;
            setCurrentPos([lat, lng]);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-white/10 relative z-0">
            <MapContainer center={[0.9, 36.0]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Route Line */}
                <Polyline positions={[startPos, endPos]} color="#10B981" dashArray="5, 10" />

                {/* Source */}
                <Marker position={startPos}>
                    <Popup>Farmer Collection Point</Popup>
                </Marker>

                {/* Destination */}
                <Marker position={endPos}>
                    <Popup>Buyer Destination ({order?.buyer__name})</Popup>
                </Marker>

                {/* Live Truck */}
                <Marker position={currentPos} icon={L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="background-color: #F59E0B; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);">
                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                           </div>`
                })}>
                    <Popup>
                        <div className="text-black font-bold">
                            Active Delivery<br />
                            Speed: 65 km/h
                        </div>
                    </Popup>
                </Marker>

            </MapContainer>
        </div>
    );
};

export default DeliveryMap;
