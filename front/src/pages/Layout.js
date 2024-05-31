import { Outlet, Link } from "react-router-dom";
import './Layout.css'

export default function Layout()  {
  return (
    <>
      <nav>
        <ul className="horizontal-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/currency">Currency</Link>
          </li>
          <li>
            <Link to="/tokens">Tokens</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </>
  )
};