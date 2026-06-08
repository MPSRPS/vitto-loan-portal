import { useLocation, NavLink } from 'react-router-dom';

const NAV = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="sidebar__link-icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 4a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2V4zM2 13a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3zM11 4a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V4zM11 13a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3z" />
      </svg>
    ),
  },
  {
    to: '/apply',
    label: 'New Application',
    icon: (
      <svg className="sidebar__link-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const CRUMBS = {
  '/dashboard': 'Dashboard',
  '/apply':     'New Application',
};

export default function AppShell({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      {/* ─── Sidebar ──────────────────────────────────── */}
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar__header">
          <div className="sidebar__logo" aria-label="Vitto">
            <svg width="108" height="33" viewBox="0 0 109 33" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M35 6.45361L27.2954 7.48792L25.2056 14.9767L32.909 13.9412L35 6.45361Z" fill="#EC224E"/>
              <path d="M29.3855 0L21.6809 1.03431L19.59 8.52311L27.2946 7.48762L29.3855 0Z" fill="#EC224E"/>
              <path d="M0 6.45361L7.70575 7.48792L9.79548 14.9767L2.09208 13.9412L0 6.45361Z" fill="#EC224E"/>
              <path d="M5.61591 0L13.3205 1.03431L15.4102 8.52311L7.70681 7.4888L5.61591 0Z" fill="#EC224E"/>
              <path d="M0 25.5695L7.70575 24.5352L9.79548 17.0464L2.09208 18.0819L0 25.5695Z" fill="#EC224E"/>
              <path d="M5.61591 32.0231L13.3205 30.9888L15.4102 23.5L7.70681 24.5355L5.61591 32.0231Z" fill="#EC224E"/>
              <path d="M35 25.5695L27.2954 24.5352L25.2056 17.0464L32.909 18.0819L35 25.5695Z" fill="#EC224E"/>
              <path d="M29.3855 32.0231L21.6809 30.9888L19.59 23.5L27.2946 24.5355L29.3855 32.0231Z" fill="#EC224E"/>
              <path d="M47.7251 27.2659L40.7137 5.7373H46.095L50.8615 21.5763L55.6279 5.7373H61.0092L53.9978 27.2659H47.7251Z" fill="white"/>
              <path d="M66.3487 9.72122C65.8059 10.264 65.1542 10.5355 64.3952 10.5355C63.6363 10.5355 62.9846 10.264 62.4417 9.72122C61.8989 9.1784 61.6275 8.52668 61.6275 7.76773C61.6275 7.00878 61.8989 6.35874 62.4417 5.81424C62.9846 5.27141 63.6363 5 64.3952 5C65.1542 5 65.8042 5.27141 66.3487 5.81424C66.8916 6.35706 67.163 7.00878 67.163 7.76773C67.163 8.52668 66.8916 9.1784 66.3487 9.72122ZM62.0882 27.2658V11.8892H66.7022V27.2658H62.0882Z" fill="white"/>
              <path d="M79.0949 16.3173H75.9267V21.7606C75.9267 22.3754 76.173 22.7658 76.6656 22.93C77.1582 23.0942 77.9674 23.1461 79.0949 23.0841V27.2675C76.163 27.5758 74.1324 27.2927 73.0049 26.4215C71.8774 25.5503 71.3128 23.9972 71.3128 21.7622V16.3189H68.8516V11.8892H71.3128V8.96736L75.9267 7.5835V11.8892H79.0949V16.3173Z" fill="white"/>
              <path d="M90.2597 16.3173H87.0915V21.7606C87.0915 22.3754 87.3378 22.7658 87.8304 22.93C88.3229 23.0942 89.1321 23.1461 90.2597 23.0841V27.2675C87.3278 27.5758 85.2972 27.2927 84.1697 26.4215C83.0421 25.5503 82.4776 23.9972 82.4776 21.7622V16.3189H80.0164V11.8892H82.4776V8.96736L87.0915 7.5835V11.8892H90.2597V16.3173Z" fill="white"/>
              <path d="M105.729 25.3443C104.149 26.9124 102.222 27.6965 99.9468 27.6965C97.6716 27.6965 95.7432 26.9124 94.165 25.3443C92.5868 23.7761 91.7977 21.8545 91.7977 19.5776C91.7977 17.3025 92.5868 15.3791 94.165 13.811C95.7432 12.2428 97.6716 11.4587 99.9468 11.4587C102.222 11.4587 104.15 12.2428 105.729 13.811C107.307 15.3791 108.096 17.3008 108.096 19.5776C108.097 21.8545 107.307 23.7761 105.729 25.3443ZM97.4253 22.1912C98.1022 22.8681 98.9432 23.2065 99.9468 23.2065C100.952 23.2065 101.791 22.8681 102.468 22.1912C103.145 21.5144 103.484 20.6432 103.484 19.5776C103.484 18.5121 103.145 17.6409 102.468 16.964C101.791 16.2872 100.95 15.9488 99.9468 15.9488C98.9415 15.9488 98.1022 16.2872 97.4253 16.964C96.7485 17.6409 96.41 18.5121 96.41 19.5776C96.41 20.6448 96.7485 21.516 97.4253 22.1912Z" fill="white"/>
            </svg>
          </div>
          <div className="sidebar__tagline">Operations Portal</div>
        </div>

        <nav className="sidebar__nav" aria-label="Primary">
          <div className="sidebar__nav-section">Menu</div>
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' active' : ''}`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__org">
            <div className="sidebar__org-avatar" aria-hidden="true">OP</div>
            <div className="sidebar__org-info">
              <div className="sidebar__org-name">Ops Team</div>
              <div className="sidebar__org-role">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main ─────────────────────────────────────── */}
      <div className="main">
        <header className="topbar">
          <div className="topbar__left">
            <nav className="topbar__crumb" aria-label="Breadcrumb">
              <span>Vitto</span>
              <span className="topbar__crumb-sep">›</span>
              <span className="topbar__crumb-current">{CRUMBS[pathname] ?? 'Page'}</span>
            </nav>
          </div>
          <div className="topbar__right">
            <div className="topbar__pill">
              <div className="topbar__dot" aria-hidden="true" />
              Live · Neon DB
            </div>
          </div>
        </header>

        <div className="page">{children}</div>
      </div>

      {/* ─── Mobile Bottom Nav ─────────────────────────── */}
      <nav className="mobile-nav" aria-label="Mobile Navigation">
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `mobile-nav__link${isActive ? ' active' : ''}`}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
