'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface MapReport {
  id: string;
  title: string;
  category: string;
  severity: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  author?: { displayName: string };
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#D92D20',
  high: '#F97316',
  medium: '#F4B400',
  low: '#2563EB',
};

export default function MapPage() {
  const [reports, setReports] = useState<MapReport[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedReport, setSelectedReport] = useState<MapReport | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        try {
          const data = await api.reports.nearby(latitude, longitude, 20);
          setReports(data);
        } catch {
          // fallback to Nigeria feed
          const data = await api.reports.feed('NG');
          setReports(data);
        }
      },
      async () => {
        // Default to Lagos if no location
        setUserLocation({ lat: 6.5244, lng: 3.3792 });
        const data = await api.reports.feed('NG');
        setReports(data);
      }
    );
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Map placeholder - will integrate Mapbox later */}
      <div className="flex-1 bg-gray-100 relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Incident Map</h2>
          <p className="text-gray-500 text-sm mb-4">
            {userLocation ? `Your location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Detecting location...'}
          </p>
          <p className="text-gray-400 text-xs">Mapbox integration coming in next sprint</p>
        </div>

        {/* Floating report count */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-4 py-3">
          <p className="text-sm font-semibold text-gray-700">{reports.length} incidents nearby</p>
        </div>
      </div>

      {/* Sidebar with report list */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto hidden lg:block">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Nearby Reports</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {reports.map((report) => (
            <div key={report.id} className="p-4 hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelectedReport(report)}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[report.severity] || '#2563EB' }} />
                <span className="text-xs text-gray-500 capitalize">{report.category.replace('_', ' ')}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{report.title}</p>
              <p className="text-xs text-gray-400 mt-1">{report.author?.displayName || 'Anonymous'}</p>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">No reports in this area yet</div>
          )}
        </div>
      </div>

      {/* Selected report popup */}
      {selectedReport && (
        <div className="absolute bottom-4 left-4 right-80 bg-white rounded-xl shadow-lg p-4 lg:right-[340px] m-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: SEVERITY_COLORS[selectedReport.severity] }}>
                {selectedReport.severity.toUpperCase()}
              </span>
              <h4 className="font-semibold text-gray-900 mt-2">{selectedReport.title}</h4>
              <p className="text-xs text-gray-500 mt-1">📍 {Number(selectedReport.latitude).toFixed(4)}, {Number(selectedReport.longitude).toFixed(4)}</p>
            </div>
            <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
