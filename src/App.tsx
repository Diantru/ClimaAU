import { DashboardPage } from './pages/DashboardPage'
import { observations } from './data/weather'

export function App() {
  return <DashboardPage observations={observations} />
}
