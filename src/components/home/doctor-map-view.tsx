
"use client";

import { Map } from "@/components/shared/map";

interface Doctor {
    uid: string;
    name: string;
}

interface DoctorMapViewProps {
    doctors: Doctor[];
}

export default function DoctorMapView({ doctors }: DoctorMapViewProps) {
    
    // NOTE: We don't have lat/lng for doctors yet.
    // This is a placeholder implementation that shows a default map.
    // A future step would involve geocoding doctor addresses.
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Centered on India

    return (
        <div className="h-[60vh] w-full rounded-lg overflow-hidden border">
            <Map center={defaultCenter} zoom={5} />
        </div>
    )
}
