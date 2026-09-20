import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Video, 
  Bus, 
  Construction, 
  TrafficCone, 
  ShieldAlert, 
  Users, 
  UserSearch, 
  AlertTriangle, 
  GitMerge, 
  HeartHandshake, 
  BarChart3, 
  FileCheck2, 
  FileText, 
  Cpu, 
  Network, 
  Lock,
  LockKeyhole,
  CheckCircle2
} from 'lucide-react';
import { NavTab, UserRole } from '../../types';

interface SidebarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  activeIncidentsCount: number;
  userRole?: UserRole;
}

interface NavSection {
  title: string;
  items: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    highlight?: boolean;
    authorizedOnly?: boolean;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  activeIncidentsCount,
  userRole = 'TRANSPORT_AUTHORITY'
}) => {
  const sections: NavSection[] = [
    {
      title: 'Primary Monitoring',
      items: [
        {
          id: 'command-center',
          label: 'Command Center',
          icon: LayoutDashboard
        },
        {
          id: 'live-gis-map',
          label: 'Live GIS Map',
          icon: Map,
          badge: 'GIS'
        },
        {
          id: 'live-ai-vision',
          label: 'Live AI Vision',
          icon: Video,
          badge: 'MVP Pipeline',
          highlight: true
        }
      ]
    },
    {
      title: 'City Intelligence',
      items: [
        {
          id: 'fleet-intelligence',
          label: 'Fleet Intelligence',
          icon: Bus
        },
        {
          id: 'road-intelligence',
          label: 'Road Intelligence',
          icon: Construction,
          badge: '6 Defects'
        },
        {
          id: 'traffic-intelligence',
          label: 'Traffic Intelligence',
          icon: TrafficCone
        }
      ]
    },
    {
      title: 'Public Safety',
      items: [
        {
          id: 'public-safety-center',
          label: 'Public Safety Center',
          icon: ShieldAlert
        },
        {
          id: 'person-intelligence',
          label: 'Person Intelligence',
          icon: Users
        },
        {
          id: 'missing-person-search',
          label: 'Missing Person Search',
          icon: UserSearch,
          authorizedOnly: true,
          badge: 'Auth'
        },
        {
          id: 'incident-center',
          label: 'Incident Center',
          icon: AlertTriangle,
          badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined
        },
        {
          id: 'cross-fleet-tracking',
          label: 'Cross-Fleet Tracking',
          icon: GitMerge,
          authorizedOnly: true
        },
        {
          id: 'womens-safety',
          label: "Women's & Commuter Safety",
          icon: HeartHandshake
        }
      ]
    },
    {
      title: 'Intelligence & Reports',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3
        },
        {
          id: 'evidence',
          label: 'Evidence Vault',
          icon: FileCheck2
        },
        {
          id: 'reports',
          label: 'Intelligence Reports',
          icon: FileText
        }
      ]
    },
    {
      title: 'System',
      items: [
        {
          id: 'system-health',
          label: 'AI System Health',
          icon: Cpu
        },
        {
          id: 'data-flow',
          label: 'Data Flow Topology',
          icon: Network
        },
        {
          id: 'security-privacy',
          label: 'Security & Privacy',
          icon: Lock,
          authorizedOnly: true
        }
      ]
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0B0D11] border-r border-[#1E222A] flex flex-col justify-between shrink-0 h-full overflow-y-auto">
      <div className="p-3 space-y-4">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold flex items-center justify-between">
              <span>{section.title}</span>
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#171A20] text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#12141A]'
                  }`}
                >
                  {/* Active Orange Border Accent */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#F97316]" />
                  )}

                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#F97316]' : 'text-gray-400 group-hover:text-gray-300'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {item.authorizedOnly && (
                      <span title="Requires Authorized Credentials">
                        <LockKeyhole className="w-3 h-3 text-gray-400 group-hover:text-amber-400" />
                      </span>
                    )}

                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        item.highlight
                          ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 font-bold'
                          : typeof item.badge === 'number'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold'
                          : 'bg-[#1C2028] text-gray-400 border border-[#262C38]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status Banner */}
      <div className="p-3 border-t border-[#1E222A] bg-[#0A0C0F] text-xs font-mono">
        <div className="p-2.5 rounded bg-[#111318] border border-[#1A1E26] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[10px]">INFERENCE ENGINE</span>
            <span className="text-emerald-400 text-[10px] font-bold">14.2 ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[10px]">CAMERAS STREAMING</span>
            <span className="text-gray-200 text-[10px]">1,184 / 1,200</span>
          </div>
          <div className="pt-1 border-t border-[#181C24] flex items-center justify-between text-[10px] text-gray-400">
            <span>AWS ap-south-1</span>
            <span className="text-emerald-400">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
