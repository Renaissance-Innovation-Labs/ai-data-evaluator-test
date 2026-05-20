import { AdminPanel } from './components/AdminPanel'
import { ValidationWorkspace } from './components/ValidationWorkspace'

export default function App() {
  if (window.location.hash === '#admin') {
    return <AdminPanel />
  }
  return <ValidationWorkspace />
}
