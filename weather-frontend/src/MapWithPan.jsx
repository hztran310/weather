import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';

const reformatString = (string) => {
    return string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const MapWithPan = ({ lat, lon, city, description }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo([lat, lon], 10, {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.25 // Smoothness of animation
        });
    }, [lat, lon]);

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lon]}>
                <Popup>
                    {reformatString(city)} <br /> {reformatString(description)}
                </Popup>
            </Marker>
        </>
    );
};

export default MapWithPan;
