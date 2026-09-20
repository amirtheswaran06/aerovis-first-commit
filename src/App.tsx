import React, { useState, useEffect } from 'react';
import { 
  NavTab, 
  Incident, 
  EvidenceRecord, 
  Bus,
  UserRole,
  RoadDefect,
  TrafficHotspot
} from './types';
import { 
  INITIAL_BUSES,
  ROAD_DEFECTS,
  TRAFFIC_HOTSPOTS
} from './data/mockData';
import { apiService } from './services/apiService';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { VideoAnalysisView } from './components/analysis/VideoAnalysisView';
import { IncidentsView } from './components/incidents/IncidentsView';
import { IncidentDetailModal } from './components/incidents/IncidentDetailModal';
import { PeopleIntelligenceView } from './components/people/PeopleIntelligenceView';
import { EvidenceLibraryView } from './components/evidence/EvidenceLibraryView';
import { VerificationView } from './components/verification/VerificationView';
import { SystemView } from './components/system/SystemView';
import { DemoGuideModal } from './components/guided/DemoGuideModal';

// Specialized City, Safety, Intelligence & GIS views
import { LiveGisMapView } from './components/gis/LiveGisMapView';
import { FleetIntelligenceView } from './components/city/FleetIntelligenceView';
import { RoadIntelligenceView } from './components/city/RoadIntelligenceView';
import { TrafficIntelligenceView } from './components/city/TrafficIntelligenceView';
import { PublicSafetyCenterView } from './components/safety/PublicSafetyCenterView';
import { MissingPersonSearchView } from './components/safety/MissingPersonSearchView';
import { CrossFleetTrackingView } from './components/safety/CrossFleetTrackingView';
import { WomensSafetyView } from './components/safety/WomensSafetyView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ReportsView } from './components/reports/ReportsView';
import { DataFlowTopologyView } from './components/system/DataFlowTopologyView';
import { SecurityPrivacyView } from './components/system/SecurityPrivacyView';

import { 
  LayoutDashboard, 
  Video, 
  AlertTriangle, 
  FileCheck2, 
  CheckCircle2, 
  Cpu, 
  Users,
  Map as MapIcon,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('command-center');
  const [userRole, setUserRole] = useState<UserRole>('TRANSPORT_AUTHORITY');
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [incidents, setIncidents] = useState<Incident[]>(apiService.getIncidents());
  const [aiEvents, setAiEvents] = useState(apiService.getAIEvents());
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(apiService.getEvidenceList());
  const [roadDefects, setRoadDefects] = useState<RoadDefect[]>(apiService.getRoadDefects());
  const [trafficHotspots, setTrafficHotspots] = useState<TrafficHotspot[]>(apiService.getTrafficHotspots());

  // Modal states
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('EVT-7F31A9');
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Poll/refresh state from service when new videos are analyzed
  const refreshState = () => {
    setIncidents(apiService.getIncidents());
    setAiEvents(apiService.getAIEvents());
    setEvidenceList(apiService.getEvidenceList());
    setRoadDefects(apiService.getRoadDefects());
    setTrafficHotspots(apiService.getTrafficHotspots());
  };

  const handleOpenIncidentDetail = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleVerifyEvidence = (evidenceId: string) => {
    setSelectedEvidenceId(evidenceId);
    setCurrentTab('verification');
  };

  const handleSelectEvidence = (evidence: EvidenceRecord) => {
    setSelectedEvidenceId(evidence.id);
    setCurrentTab('verification');
  };

  const handleSelectBus = (bus: Bus) => {
    // When a bus is selected, user can inspect or track
  };

  const activeIncidentsCount = incidents.filter((i) => i.status === 'NEW' || i.status === 'UNDER_REVIEW' || i.status === 'ASSIGNED' || i.status === 'RESPONDING').length || 12;

  return (
    <div className="min-h-screen bg-[#08090B] text-gray-100 flex flex-col font-sans selection:bg-[#F97316]/30 selection:text-[#F97316]">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          refreshState();
        }}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        notificationsCount={activeIncidentsCount}
        userRole={userRole}
        onRoleChange={(role) => setUserRole(role)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            refreshState();
          }}
          activeIncidentsCount={activeIncidentsCount}
          userRole={userRole}
        />

        {/* Primary Viewport Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {/* 1. PRIMARY MONITORING */}
            {currentTab === 'command-center' && (
              <CommandCenter
                buses={buses}
                incidents={incidents}
                aiEvents={aiEvents}
                roadDefects={roadDefects}
                trafficHotspots={trafficHotspots}
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
                onSelectIncident={handleOpenIncidentDetail}
                onSelectBus={handleSelectBus}
              />
            )}

            {currentTab === 'live-gis-map' && (
              <LiveGisMapView
                buses={buses}
                incidents={incidents}
                roadDefects={roadDefects}
                trafficHotspots={trafficHotspots}
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
                onSelectIncident={handleOpenIncidentDetail}
                onSelectBus={handleSelectBus}
              />
            )}

            {(currentTab === 'live-ai-vision' || currentTab === 'video-analysis') && (
              <VideoAnalysisView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
                onOpenIncidentDetail={handleOpenIncidentDetail}
                onOpenEvidenceDetail={(ev) => {
                  setSelectedEvidenceId(ev.id);
                  setCurrentTab('verification');
                }}
              />
            )}

            {/* 2. CITY INTELLIGENCE */}
            {currentTab === 'fleet-intelligence' && (
              <FleetIntelligenceView
                buses={buses}
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
                onSelectBus={handleSelectBus}
              />
            )}

            {currentTab === 'road-intelligence' && (
              <RoadIntelligenceView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
              />
            )}

            {currentTab === 'traffic-intelligence' && (
              <TrafficIntelligenceView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
              />
            )}

            {/* 3. PUBLIC SAFETY */}
            {currentTab === 'public-safety-center' && (
              <PublicSafetyCenterView
                incidents={incidents}
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
                onSelectIncident={handleOpenIncidentDetail}
                userRole={userRole}
              />
            )}

            {(currentTab === 'person-intelligence' || currentTab === 'people') && (
              <PeopleIntelligenceView />
            )}

            {currentTab === 'missing-person-search' && (
              <MissingPersonSearchView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
                userRole={userRole}
              />
            )}

            {(currentTab === 'incident-center' || currentTab === 'incidents') && (
              <IncidentsView
                incidents={incidents}
                onSelectIncident={handleOpenIncidentDetail}
                onVerifyEvidence={handleVerifyEvidence}
              />
            )}

            {currentTab === 'cross-fleet-tracking' && (
              <CrossFleetTrackingView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
              />
            )}

            {currentTab === 'womens-safety' && (
              <WomensSafetyView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
              />
            )}

            {/* 4. INTELLIGENCE & REPORTS */}
            {currentTab === 'analytics' && (
              <AnalyticsView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
              />
            )}

            {currentTab === 'evidence' && (
              <EvidenceLibraryView
                evidenceList={evidenceList}
                onSelectEvidence={handleSelectEvidence}
                onVerifyEvidence={handleVerifyEvidence}
              />
            )}

            {currentTab === 'verification' && (
              <VerificationView
                evidenceList={evidenceList}
                activeEvidenceId={selectedEvidenceId}
                onSelectEvidence={handleSelectEvidence}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
              />
            )}

            {/* 5. SYSTEM */}
            {(currentTab === 'system-health' || currentTab === 'system') && (
              <SystemView />
            )}

            {currentTab === 'data-flow' && (
              <DataFlowTopologyView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
              />
            )}

            {currentTab === 'security-privacy' && (
              <SecurityPrivacyView
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  refreshState();
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar (Quick Core Access) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B0D11] border-t border-[#1E222A] px-2 flex items-center justify-around z-40">
        <button
          onClick={() => setCurrentTab('command-center')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[48px] rounded cursor-pointer ${
            currentTab === 'command-center' ? 'text-[#F97316]' : 'text-gray-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-mono">Center</span>
        </button>

        <button
          onClick={() => setCurrentTab('live-gis-map')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[48px] rounded cursor-pointer ${
            currentTab === 'live-gis-map' ? 'text-[#F97316]' : 'text-gray-400'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-mono">GIS</span>
        </button>

        <button
          onClick={() => setCurrentTab('live-ai-vision')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[48px] rounded relative cursor-pointer ${
            currentTab === 'live-ai-vision' || currentTab === 'video-analysis' ? 'text-[#F97316]' : 'text-gray-400'
          }`}
        >
          <Video className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-mono">Vision</span>
          <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#F97316]" />
        </button>

        <button
          onClick={() => setCurrentTab('incident-center')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[48px] rounded cursor-pointer ${
            currentTab === 'incident-center' || currentTab === 'incidents' ? 'text-[#F97316]' : 'text-gray-400'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-mono">Alerts</span>
        </button>

        <button
          onClick={() => setCurrentTab('public-safety-center')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[48px] rounded cursor-pointer ${
            currentTab === 'public-safety-center' ? 'text-[#F97316]' : 'text-gray-400'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-mono">Safety</span>
        </button>

        <button
          onClick={() => setCurrentTab('verification')}
          className={`flex flex-col items-center justify-center p-1 min-w-[48px] min-h-[48px] rounded cursor-pointer ${
            currentTab === 'verification' ? 'text-[#F97316]' : 'text-gray-400'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 font-mono">Verify</span>
        </button>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onVerifyEvidence={handleVerifyEvidence}
        />
      )}

      {/* 3-Minute Hackathon Demo Story Guide Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          refreshState();
        }}
      />
    </div>
  );
}
