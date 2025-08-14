import { Routes, Route, NavLink } from 'react-router-dom';
import { InventoryPage } from './app/routes/InventoryPage';
import { FormulasPage } from './app/routes/FormulasPage';
import { FormulaDetailPage } from './app/routes/FormulaDetailPage';
import { DashboardPage } from './app/routes/DashboardPage';
import { SettingsPage } from './app/routes/SettingsPage';
import { NotFoundPage } from './app/routes/NotFoundPage';
import { EvaluationsPage } from './app/routes/EvaluationsPage';
import { OnboardingPage } from './app/routes/OnboardingPage';
import CoachPanel from './components/coach/CoachPanel';
import TipToggle from './components/tips/TipToggle';

export default function App() {
  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <nav style={{width:250, padding:'1rem', background:'linear-gradient(180deg,#15181e 60%,#0f766e 100%)', color:'#fff', fontFamily:'Segoe UI,Arial,sans-serif', boxShadow:'2px 0 8px #0002', display:'flex', flexDirection:'column', gap:'1rem'}}>
        <h3 style={{fontWeight:'bold', fontSize:'1.5rem', letterSpacing:'1px'}}>Parfumerie Expert</h3>
        <ul style={{listStyle:'none', padding:0, margin:0, fontSize:'1.1rem'}}>
          <li><NavLink to="/" end>Accueil</NavLink></li>
          <li><NavLink to="/onboarding">Premiers pas</NavLink></li>
          <li><NavLink to="/inventory">Inventaire</NavLink></li>
          <li><NavLink to="/formulas">Formules</NavLink></li>
          <li><NavLink to="/settings">Paramètres</NavLink></li>
        </ul>
        <TipToggle />
        <div style={{marginTop:'2rem', fontSize:'0.95rem', color:'#e0e0e0'}}>
          <span style={{fontWeight:'bold'}}>💡 Astuce parfumeur :</span> Utilisez la famille olfactive pour équilibrer vos créations.
        </div>
      </nav>
      <main style={{flex:1, padding:'1rem 2rem', position:'relative'}}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/formulas" element={<FormulasPage />} />
          <Route path="/formulas/:id" element={<FormulaDetailPage />} />
          <Route path="/formulas/:id/evaluations" element={<EvaluationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <CoachPanel />
      </main>
    </div>
  );
}