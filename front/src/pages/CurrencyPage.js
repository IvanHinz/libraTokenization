import LaunchCurrency from '../components/LibraCurrencyFront.js'
import LaunchDEX from '../components/LibraDEXFront.js'
import './CurrencyPage.css'

export default function CurrencyPage() {
  return (
    <div className="currency-container">
      <div className="left-part">
      <LaunchCurrency />
      </div>
      <div className="right-part">
      <LaunchDEX />
      </div>
    </div>
  );
}