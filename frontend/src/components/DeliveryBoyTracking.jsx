import React, { useEffect, useState } from 'react'
import scooter from "../assets/scooter.png"
import home from "../assets/home.png"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { useSelector } from 'react-redux'
const deliveryBoyIcon = new L.Icon({
    iconUrl: scooter,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
})
const customerIcon = new L.Icon({
    iconUrl: home,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
})
function DeliveryBoyTracking({ data }) {

    const deliveryBoyLat = data.deliveryBoyLocation.lat
    const deliveryBoylon = data.deliveryBoyLocation.lon
    const customerLat = data.customerLocation.lat
    const customerlon = data.customerLocation.lon

    const path = [
        [deliveryBoyLat, deliveryBoylon],
        [customerLat, customerlon]
    ]

    const center = [deliveryBoyLat, deliveryBoylon]
    const [route, setRoute] = useState([]);

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${deliveryBoylon},${deliveryBoyLat};${customerlon},${customerLat}?overview=full&geometries=geojson`;

                const res = await fetch(url);
                const data = await res.json();

                const coordinates = data.routes[0].geometry.coordinates;

                // Convert [lon, lat] → [lat, lon]
                const formatted = coordinates.map(coord => [coord[1], coord[0]]);

                setRoute(formatted);

            } catch (err) {
                console.log("Route error:", err);
            }
        };

        fetchRoute();
    }, [deliveryBoyLat, deliveryBoylon, customerLat, customerlon]);

    return (
        <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md'>
            <MapContainer
                className={"w-full h-full"}
                center={center}
                zoom={16}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[deliveryBoyLat, deliveryBoylon]} icon={deliveryBoyIcon}>
                    <Popup>Delivery Boy</Popup>
                </Marker>
                <Marker position={[customerLat, customerlon]} icon={customerIcon}>
                    <Popup>Customer</Popup>
                </Marker>


                {route.length > 0 && (
                    <Polyline positions={route} color='blue' weight={4} />
                )}

            </MapContainer>
        </div>
    )
}

export default DeliveryBoyTracking
