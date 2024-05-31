import LaunchCurrency from '../components/LibraCurrencyFront.js'
import LaunchDEX from '../components/LibraDEXFront.js'

export default function CurrencyPage() {
  return (
    <div>
      <LaunchCurrency />
      <hr />
      <LaunchDEX />
    </div>
  );
}