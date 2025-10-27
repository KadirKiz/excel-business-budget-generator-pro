import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { SetupWizard } from './pages/SetupWizard';
import { Dashboard } from './pages/Dashboard';
import { TransactionLog } from './pages/TransactionLog';
import { Analysis } from './pages/Analysis';
import { ModuleManager } from './pages/ModuleManager';
import { DataImport } from './pages/DataImport';
import { ExportGenerator } from './pages/ExportGenerator';
import { Settings } from './pages/Settings';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/setup" element={<SetupWizard />} />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/transactions"
          element={
            <AppLayout>
              <TransactionLog />
            </AppLayout>
          }
        />
        <Route
          path="/analysis"
          element={
            <AppLayout>
              <Analysis />
            </AppLayout>
          }
        />
        <Route
          path="/modules"
          element={
            <AppLayout>
              <ModuleManager />
            </AppLayout>
          }
        />
        <Route
          path="/data"
          element={
            <AppLayout>
              <DataImport />
            </AppLayout>
          }
        />
        <Route
          path="/export"
          element={
            <AppLayout>
              <ExportGenerator />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}
