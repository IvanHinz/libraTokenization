import LaunchLogin from '../components/Login.js'
import './LoginPage.css'

export default function LoginPage({ setToken }) {
  return (
    <div className="login-container">
      <LaunchLogin setToken={setToken}/>
    </div>
  );
}