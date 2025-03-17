//importation de feuille de style
import "../../styles/Contact/Map.css";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fixer l'icône du marqueur
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapComponent() {
    return (
        <MapContainer center={[4.052544, 9.6963304]} zoom={13} style={{ height: "70vh", width: "100%" }} className='map'>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[4.052544, 9.6963304]}>
                <Popup>
                    Venez découvrir nos locaux
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;