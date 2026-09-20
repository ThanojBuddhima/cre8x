import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Providers } from '@/app/providers'
import { AppShell } from '@/components/navigation/AppShell'
import { JourneyDetails } from '@/pages/journey/screen'
import { LandingHome } from '@/pages/home/screen'
import { LiveTracking } from '@/pages/live/screen'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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
