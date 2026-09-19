import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Providers } from '@/app/providers'
import { AppShell } from '@/components/navigation/AppShell'
import { JourneyDetails } from '@/pages/JourneyDetails'
import { LandingHome } from '@/pages/LandingHome'
import { LiveTracking } from '@/pages/LiveTracking'

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<LandingHome />} />
            <Route path="/journey/:id" element={<JourneyDetails />} />
            <Route path="/live/:id" element={<LiveTracking />} />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  )
}
