import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, BriefcaseBusiness, ChevronDown, FileText, HandCoins, LayoutGrid, Landmark, Menu, ReceiptText, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Input, SidebarItem } from "../components/ui";
import { useState } from "react";

const sections = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { label: "Finance", path: "/finance", icon: HandCoins },
  { label: "Sales CRM", path: "/sales-crm", icon: BriefcaseBusiness },
];

const rmsItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { label: "Disbursement", path: "/disbursement", icon: Landmark },
  { label: "Invoices", path: "/invoices", icon: ReceiptText },
  { label: "PO", path: "/po", icon: FileText },
  { label: "RMS Reports", path: "/rms-reports", icon: FileText },
];

const lowerItems = [
  { label: "Compliance", path: "/compliance", icon: ShieldCheck },
  { label: "Vendors", path: "/vendors", icon: Users },
  { label: "AI Suite", path: "/ai-suite", icon: Sparkles },
  { label: "Reports", path: "/reports", icon: FileText },
];

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const renderSidebar = () => (
    <>
      <p className="mb-4 text-xl font-semibold text-white">FinBowl</p>
      <div className="relative mb-3">
        <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[#C7C2DF]" />
        <Input placeholder="Search" className="border-[#3B2A78] bg-[#2F1F63] pl-8 text-white placeholder:text-[#C7C2DF]" />
      </div>

      <div className="space-y-1 border-b border-[#3B2A78] pb-3">
        {sections.map((item) => (
          <SidebarItem
            key={item.path}
            active={location.pathname.startsWith(item.path)}
            onClick={() => {
              navigate(item.path);
              setMobileSidebarOpen(false);
            }}
          >
            <div className="flex items-center gap-2">
              <item.icon size={14} />
              {item.label}
              {(item.label === "Finance" || item.label === "Sales CRM") && <ChevronDown size={12} className="ml-auto" />}
            </div>
          </SidebarItem>
        ))}
      </div>

      <div className="mt-3">
        <p className="mb-2 px-2 text-xs font-semibold tracking-wide text-[#A69EC9]">RMS</p>
        <div className="space-y-1 border-b border-[#3B2A78] pb-3">
          {rmsItems.map((item) => (
            <SidebarItem
              key={item.path}
              active={location.pathname.startsWith(item.path)}
              onClick={() => {
                navigate(item.path);
                setMobileSidebarOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <item.icon size={14} />
                {item.label}
              </div>
            </SidebarItem>
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {lowerItems.map((item) => (
          <SidebarItem
            key={item.path}
            active={location.pathname.startsWith(item.path)}
            onClick={() => {
              navigate(item.path);
              setMobileSidebarOpen(false);
            }}
          >
            <div className="flex items-center gap-2">
              <item.icon size={14} />
              {item.label}
            </div>
          </SidebarItem>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <span className="rounded-full bg-[#3B2A78] px-3 py-1 text-[11px] text-[#C7C2DF]">Version 1.0</span>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F6F4FF] text-[#111827]">
      <aside className="hidden w-64 flex-col bg-[#25164E] p-4 lg:flex">{renderSidebar()}</aside>
      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <aside className="h-full w-64 bg-[#25164E] p-4" onClick={(event) => event.stopPropagation()}>
            {renderSidebar()}
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#EAE7F7] bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <button className="rounded-md border border-[#E5E7EB] p-2 lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={16} />
            </button>
            <span className="rounded-md border border-[#EAE7F7] bg-white px-3 py-1 text-black font-medium text-xs">
              Gracia Advisory Group / ABC Advisory Group
            </span>
       
       
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-[#F5F3FF] p-2 text-[#6F52ED]">
              <Bell size={16} />
            </button>
            <div className="flex items-center">
              {!avatarLoadError ? (
                <img
                  src="/avatar.png"
                  alt="User Avatar"
                  onError={() => setAvatarLoadError(true)}
                  className="h-8 w-8 rounded-full object-cover border border-[#EAE7F7]"
                />
              ) : (
                <svg
                  viewBox="0 0 32 32"
                  aria-label="Default Avatar"
                  className="h-8 w-8 rounded-full border border-[#EAE7F7]"
                  role="img"
                >
                  <circle cx="16" cy="16" r="16" fill="#EDE9FE" />
                  <circle cx="16" cy="12" r="6" fill="#6F52ED" />
                  <path d="M6 27c0-5 4.5-8 10-8s10 3 10 8" fill="#6F52ED" />
                </svg>
              )}
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
