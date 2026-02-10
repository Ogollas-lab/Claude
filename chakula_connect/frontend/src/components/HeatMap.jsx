import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix Leaflet marker icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useLanguage } from '../context/LanguageContext';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const HeatMap = () => {
    const { t } = useLanguage();
    const [mapData, setMapData] = useState({ surplus_locations: [], drought_zones: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In production, use env var. Dev defaults to localhost:8000
                console.log("Fetching map data...");
                const response = await axios.get('http://127.0.0.1:8000/api/heatmap/');
                console.log("Map data received:", response.data);
                setMapData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching map data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-white">{t.heatMap.loading}</div>;

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 relative z-0">
            <MapContainer center={[1.2921, 36.8219]} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* 1. Surplus Locations (Green Circles) */}
                {mapData.surplus_locations.map((loc, idx) => (
                    <CircleMarker
                        key={`surplus-${idx}`}
                        center={[loc.lat, loc.lng]}
                        pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.7 }}
                        radius={10}
                    >
                        <Popup>
                            <div className="text-black font-bold">
                                {loc.details}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* 2. Drought Zones (Red Pulsing Areas) - Simulated with large circles for now */}
                {mapData.drought_zones.map((zone, idx) => (
                    <CircleMarker
                        key={`drought-${idx}`}
                        center={[zone.lat, zone.lng]}
                        pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.3 }}
                        radius={50} // Large radius to simulate region
                    >
                        <Popup>
                            <div className="text-black">
                                <h3 className="font-bold text-red-600">DROUGHT ALERT: {zone.region}</h3>
                                <p>Severity: {zone.severity * 100}%</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

            </MapContainer>

            <div className="absolute bottom-4 left-4 bg-black/80 p-4 rounded-lg backdrop-blur-md z-[1000] border border-white/10">
                <h3 className="font-bold text-white mb-2">{t.heatMap.legend}</h3>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-300">{t.heatMap.surplus}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500"></div>
                    <span className="text-xs text-gray-300">{t.heatMap.drought}</span>
                </div>
            </div>
        </div>
    );
};

export default HeatMap;
