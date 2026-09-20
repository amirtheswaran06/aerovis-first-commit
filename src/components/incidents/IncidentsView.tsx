import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Incident, EventCategory, Severity } from '../../types';

interface IncidentsViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onVerifyEvidence: (evidenceId: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  onSelectIncident,
  onVerifyEvidence
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filters = ['All', 'Critical', 'Safety', 'Road', 'Driver', 'Passenger'];

  const filteredIncidents = incidents.filter((incident) => {
    // Search match
    const matchesSearch = 
      incident.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.busId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Critical') return incident.severity === 'CRITICAL';
    if (selectedFilter === 'Safety') return incident.category === 'safety' || incident.severity === 'HIGH';
    if (selectedFilter === 'Road') return incident.category === 'road';
    if (selectedFilter === 'Driver') return incident.category === 'driver';
    if (selectedFilter === 'Passenger') return incident.category === 'passenger';

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-lg bg-[#111318] border border-[#1E222A]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            Incident Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Search, filter, and audit verified AI vision safety events across the transit fleet.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-gray-400 bg-[#0A0C0F] px-3 py-1.5 rounded border border-[#1C2028]">
          <span className="text-white font-bold">{filteredIncidents.length}</span>
          <span>incidents listed</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#111318] border border-[#1E222A]">
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F97316] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#171A20]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event, bus, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111318] border border-[#1E222A] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F97316]/50 font-mono"
          />
        </div>
      </div>

      {/* Incidents Table / List */}
      <div className="bg-[#111318] border border-[#1E222A] rounded-lg overflow-hidden">
        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-gray-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No incidents yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Upload bus footage to generate your first AI event or adjust your search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E222A] bg-[#0E1015] text-[10px] font-mono uppercase text-gray-400">
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Bus</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1E26] text-xs">
                {filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => onSelectIncident(incident)}
                    className="hover:bg-[#151820] transition-colors cursor-pointer group"
                  >
                    {/* Event Type */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          incident.severity === 'CRITICAL'
                            ? 'bg-red-500'
                            : incident.severity === 'HIGH'
                            ? 'bg-[#F97316]'
                            : 'bg-amber-400'
                        }`} />
                        <div>
                          <span className="font-semibold text-white group-hover:text-[#F97316] transition-colors block">
                            {incident.eventType}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {incident.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Bus ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-200">
                      {incident.busId}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px] truncate max-w-[180px]">
                      {incident.location}
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {incident.relativeTime}
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                        {incident.confidence}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-[#171A20] text-gray-300 border border-[#232730]">
                        {incident.status}
                      </span>
                    </td>

                    {/* Verification */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>VERIFIED</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(incident);
                        }}
                        className="p-1.5 rounded hover:bg-[#1F2430] text-gray-400 hover:text-white transition-colors"
                        title="View Incident Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
