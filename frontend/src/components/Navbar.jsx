import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__brand">
        <span className="navbar__brand-dot" aria-hidden="true" />
        Vitto
      </div>

      <ul className="navbar__links">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' active' : ''}`
            }
            id="nav-dashboard"
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/apply"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' active' : ''}`
            }
            id="nav-apply"
          >
            Apply
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
