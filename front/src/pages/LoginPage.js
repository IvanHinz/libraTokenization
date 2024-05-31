import LaunchLogin from '../components/Login.js'
import './LoginPage.css'

export default function LoginPage({ setToken }) {
  return (
    <div>
      <LaunchLogin setToken={setToken}/>
    </div>
  );
}