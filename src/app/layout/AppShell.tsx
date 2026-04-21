import { NavLink, Outlet } from 'react-router-dom'
import { useSession } from '@/app/session-context'
import { cn } from '@/lib/utils'

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/requests', label: 'Purchase Requests' },
  { to: '/requests/new', label: 'Create Request' },
]

export function AppShell() {
  const { currentUser, availableUsers, setCurrentUser } = useSession()

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 px-6 py-8 text-slate-200 lg:block">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">ERP Workflow</p>
            <h1 className="mt-3 text-2xl font-semibold text-white">Approval Dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Frontend simulation for purchase request approval and posting workflows.
            </p>
          </div>

          <nav className="mt-10 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-slate-800 text-white shadow-lg shadow-slate-950/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Environment</p>
            <p className="mt-2 text-sm font-medium text-white">Mock API workspace</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Designed to swap to a real .NET API later without changing the page structure.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Current actor</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{currentUser.name}</p>
                <p className="text-sm text-slate-500">
                  {currentUser.role} · {currentUser.department}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-600" htmlFor="actor-switcher">
                  Switch demo persona
                </label>
                <select
                  id="actor-switcher"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  value={currentUser.id}
                  onChange={(event) => setCurrentUser(event.target.value)}
                >
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
