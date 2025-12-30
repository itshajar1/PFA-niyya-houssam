import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Target,
  Sparkles,
  Search,
  Bell,
  Menu,
} from "lucide-react";

export default function StartupDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  // Mock data
  const startupData = {
    name: "GreenTech Solutions",
    sector: "CleanTech",
    profileScore: 78,
    pitchesGenerated: 12,
    investorsMatched: 8,
    milestonesCompleted: 6,
    totalMilestones: 10,
  };

  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Profil Startup", icon: Users },
    { name: "Générateur IA", icon: Lightbulb },
    { name: "Investisseurs", icon: TrendingUp },
    { name: "Analytics", icon: MessageSquare },
  ];

  const recentPitches = [
    { id: 1, title: "Pitch Série A", date: "2h", status: "Généré" },
    {
      id: 2,
      title: "Pitch Investisseur Angel",
      date: "1j",
      status: "En révision",
    },
    { id: 3, title: "Pitch Concours", date: "3j", status: "Exporté" },
  ];

  const matchedInvestors = [
    { name: "Green Capital Partners", compatibility: 92, sector: "CleanTech" },
    { name: "EcoFund Ventures", compatibility: 87, sector: "Sustainability" },
    { name: "Innovation Capital", compatibility: 83, sector: "Tech" },
  ];

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-60 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex-shrink-0 flex flex-col h-full
      `}
      >
        {/* Brand Logo */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-black dark:text-white">
              StartupHub
            </h1>
            <p className="text-xs text-gray-500">IA Platform</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white dark:bg-[#262626] border border-[#E4E4E4] dark:border-[#404040] text-black dark:text-white"
                      : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-black dark:text-white"
                        : "text-black/70 dark:text-white/70"
                    }
                  />
                  <span className="font-medium text-sm font-plus-jakarta">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10"
            >
              <Menu size={20} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white font-inter">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-[200px] h-10 pl-10 pr-4 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] text-sm"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#6E6E6E]"
              />
            </div>

            <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center">
              <Bell size={18} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">YH</span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl p-6 md:p-8 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Bienvenue, {startupData.name} ! 🚀
                  </h2>
                  <p className="text-white/90 mb-4">
                    Secteur: {startupData.sector} • Score de profil:{" "}
                    {startupData.profileScore}%
                  </p>
                  <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-semibold transition-colors">
                    Compléter le profil
                  </button>
                </div>
                <div className="hidden md:block">
                  <Sparkles size={64} className="text-white/30" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              {/* Left column - Main metrics */}
              <div className="xl:col-span-2 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-4 border border-[#E6E6E6] dark:border-[#333333]">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-[#6366F1]" />
                      <span className="text-xs font-medium text-gray-500">
                        Score Profil
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-black dark:text-white mb-1">
                      {startupData.profileScore}%
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowUp size={12} className="text-green-500" />
                      <span className="text-xs text-green-500">+5.2%</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-4 border border-[#E6E6E6] dark:border-[#333333]">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={16} className="text-[#8B5CF6]" />
                      <span className="text-xs font-medium text-gray-500">
                        Pitchs IA
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-black dark:text-white mb-1">
                      {startupData.pitchesGenerated}
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowUp size={12} className="text-green-500" />
                      <span className="text-xs text-green-500">+3 ce mois</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-4 border border-[#E6E6E6] dark:border-[#333333]">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-[#10B981]" />
                      <span className="text-xs font-medium text-gray-500">
                        Investisseurs
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-black dark:text-white mb-1">
                      {startupData.investorsMatched}
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowUp size={12} className="text-green-500" />
                      <span className="text-xs text-green-500">2 nouveaux</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-4 border border-[#E6E6E6] dark:border-[#333333]">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-[#F59E0B]" />
                      <span className="text-xs font-medium text-gray-500">
                        Jalons
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-black dark:text-white mb-1">
                      {startupData.milestonesCompleted}/
                      {startupData.totalMilestones}
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowUp size={12} className="text-green-500" />
                      <span className="text-xs text-green-500">60% fait</span>
                    </div>
                  </div>
                </div>

                {/* AI Pitch Generator Card */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-[#E6E6E6] dark:border-[#333333]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] rounded-lg flex items-center justify-center">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        Générateur de Pitch IA
                      </h3>
                    </div>
                    <button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Créer un pitch
                    </button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Générez un pitch professionnel en 30 secondes avec notre IA
                    basée sur Google Gemini
                  </p>

                  <div className="space-y-3">
                    {recentPitches.map((pitch) => (
                      <div
                        key={pitch.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#262626] rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-black dark:text-white">
                            {pitch.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Il y a {pitch.date}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            pitch.status === "Généré"
                              ? "bg-green-100 text-green-700"
                              : pitch.status === "En révision"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {pitch.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column - Secondary panels */}
              <div className="space-y-6">
                {/* Profile Completion */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-[#E6E6E6] dark:border-[#333333]">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                    Complétion du Profil
                  </h3>

                  {/* Progress circle */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-24 h-24">
                      <svg
                        className="w-24 h-24 transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#6366F1"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${startupData.profileScore * 2.51}, 251`}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-black dark:text-white">
                          {startupData.profileScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Informations de base
                      </span>
                      <span className="text-green-500">✓</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Équipe fondatrice
                      </span>
                      <span className="text-green-500">✓</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Business Model
                      </span>
                      <span className="text-yellow-500">⚠️</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Financements
                      </span>
                      <span className="text-gray-400">○</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-[#F3F4F6] dark:bg-[#262626] text-black dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-[#E5E7EB] dark:hover:bg-[#333333] transition-colors">
                    Compléter le profil
                  </button>
                </div>

                {/* Matched Investors */}
                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-[#E6E6E6] dark:border-[#333333]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      Investisseurs Matchés
                    </h3>
                    <span className="text-sm text-gray-500">
                      {startupData.investorsMatched} trouvés
                    </span>
                  </div>

                  <div className="space-y-3">
                    {matchedInvestors.map((investor, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-[#262626] rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-black dark:text-white text-sm">
                            {investor.name}
                          </h4>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {investor.compatibility}% match
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {investor.sector}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 bg-[#F3F4F6] dark:bg-[#262626] text-black dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-[#E5E7EB] dark:hover:bg-[#333333] transition-colors">
                    Voir tous les investisseurs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-plus-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
    </div>
  );
}



