import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import Reports from './pages/Reports';
import PrintView from './pages/PrintView';
import Configuration from './pages/Configuration';
import Jackpot from './pages/Jackpot';
import { MOCK_USERS } from './data/mockData';
import { User, AppSettings, AppNotification } from './types';
import { Users, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { getAppSettings } from './data/supabaseService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); 
  const [loading, setLoading] = useState(true);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    appName: 'GalgoTrack',
    appLogo: null,
    ticketName: 'CONSORCIO GALGOTRACK',
    ticketLogo: null
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // CARGA INICIAL DE SUPABASE (Settings Globales)
  useEffect(() => {
    const initApp = async () => {
      try {
        const settings = await getAppSettings();
        if (settings) setAppSettings(settings);
      } catch (err) {
        console.error("Error cargando settings de Supabase:", err);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);

  // SUSCRIPCIÓN REALTIME A ALERTAS
  useEffect(() => {
    const channel = supabase
      .channel('system-alerts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        const newNotif: AppNotification = {
          id: payload.new.id,
          title: payload.new.title,
          message: payload.new.message,
          type: payload.new.type as any,
          timestamp: new Date().toLocaleTimeString(),
          read: false
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 10));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
        <h1 className="text-xl font-black tracking-widest uppercase">Cargando GalgoTrack</h1>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'machines':
        return <Machines user={currentUser} />;
      case 'reports':
        return <Reports user={currentUser} appSettings={appSettings} />;
      case 'jackpot':
        return <Jackpot user={currentUser} />;
      case 'print':
        return <PrintView appSettings={appSettings} />;
      case 'config':
        return (
          <Configuration 
            user={currentUser}
            appSettings={appSettings} 
            onUpdateSettings={setAppSettings} 
          />
        );
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  return (
    <>
       <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div className="mt-2 bg-slate-800 text-white text-xs rounded-full px-4 py-1.5 shadow-xl pointer-events-auto flex items-center space-x-2 border border-slate-600">
          <Users size={12} className="text-emerald-400" />
          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Rol Activo:</span>
          <select 
            className="bg-transparent border-none outline-none font-bold text-white cursor-pointer"
            value={currentUser.id}
            onChange={(e) => {
              const user = MOCK_USERS.find(u => u.id === e.target.value);
              if (user) {
                setCurrentUser(user);
                setCurrentView('dashboard');
              }
            }}
          >
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id} className="text-black">
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <Layout 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        user={currentUser}
        appSettings={appSettings}
        notifications={notifications}
        onMarkAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onClearNotifications={() => setNotifications([])}
      >
        {renderView()}
      </Layout>
    </>
  );
};

export default App;