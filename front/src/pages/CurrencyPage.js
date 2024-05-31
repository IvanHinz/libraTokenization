import LaunchCurrency from '../LibraCurrencyFront.js'
import LaunchDEX from '../LibraDEXFront.js'

export default function CurrencyPage() {
  return (
    <div>
      <LaunchCurrency />
      <hr />
      <LaunchDEX />
    </div>
  );
}