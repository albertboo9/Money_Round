//importation de feuille de style
import "../../styles/contact/Map.css";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import marketIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import marketIcon from 'leaflet/dist/images/marker-icon.png';
import marketShadow from 'leaflet/dist/images/marker-shadow.png';

// Fixer l'icône du marqueur
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: marketIcon2x,
    iconUrl: marketIcon,
    shadowUrl: marketShadow,
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