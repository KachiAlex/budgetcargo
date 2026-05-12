import { useState } from 'react';
import {
  Plane,
  Package,
  Clock,
  MapPin,
  Bot,
  ArrowRight,
  Check,
  Shield,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    description: '',
    weight: '',
    delivery: 'collect-lilongwe',
    priority: false,
    insurance: false
  });

  const calculatePrice = () => {
    const weight = parseFloat(formData.weight) || 0;
    let basePrice = 0;

    if (weight === 0) return null;
    if (weight <= 5) basePrice = 45;
    else if (weight <= 10) basePrice = 82;
    else if (weight <= 20) basePrice = weight * 8.30;
    else basePrice = weight * 7.50;

    const priorityFee = formData.priority ? 12 : 0;
    const insuranceFee = formData.insurance ? 6 : 0;

    return {
      base: basePrice,
      priority: priorityFee,
      insurance: insuranceFee,
      total: basePrice + priorityFee + insuranceFee
    };
  };

  const price = calculatePrice();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">Corridor OS</div>
            <div className="text-xl font-bold">BudgetCargo</div>
          </div>
          <nav className="flex gap-8 text-sm">
            <a href="#process" className="hover:text-blue-600">How it works</a>
            <a href="#pricing" className="hover:text-blue-600">Pricing</a>
            <a href="#quote" className="hover:text-blue-600">Get Quote</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1699498648836-945c2c60912b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
            alt="Airplane at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-orange-600/75"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-full text-sm mb-6">
              🇬🇧 UK ↦ 🇲🇼 Malawi
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
              Rewrite how UK carts land in Lilongwe.
            </h1>
            <p className="text-xl text-blue-50 mb-8 leading-relaxed">
              BudgetCargo blends warehouse automation, customs prep, and WhatsApp ops so Malawi shoppers get parcels in days—not months.
            </p>
            <div className="flex gap-4">
              <a
                href="#quote"
                className="bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2 font-medium"
              >
                Launch a shipment
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#flights"
                className="border-2 border-white/40 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
                View flight slate
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-2">Average intake</div>
              <div className="text-3xl font-bold mb-1 text-white">96 hrs</div>
              <div className="text-sm text-blue-100">Store checkout ➝ Manifest</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-2">Coverage</div>
              <div className="text-3xl font-bold mb-1 text-white">Lilongwe · Blantyre</div>
              <div className="text-sm text-blue-100">Home or pickup hub</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-2">Automation</div>
              <div className="text-3xl font-bold mb-1 text-white">24/7</div>
              <div className="text-sm text-blue-100">WhatsApp bots & email rails</div>
            </div>
          </div>

          {/* Trust */}
          <div className="mt-12 text-sm text-blue-100">
            Trusted by diaspora shopping clubs, boutique resellers, and family shippers.
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <span className="bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30">ASOS hauls</span>
            <span className="bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30">Zara drops</span>
            <span className="bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/30">Parts consignments</span>
          </div>
        </div>
      </section>

      {/* Live Manifest */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-sm opacity-80 mb-1">Manifest · 342-B</div>
              <h2 className="text-2xl font-bold">Leeds consolidation closes in 04:12</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
              Live lane
            </div>
          </div>

          <div className="space-y-2 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Parcel photos + weight captured
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Duty simulation complete
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Payment links waiting for confirmation
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-sm opacity-80 mb-1">Parcels</div>
              <div className="text-3xl font-bold">128</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">Capacity</div>
              <div className="text-3xl font-bold">78%</div>
            </div>
            <div>
              <div className="text-sm opacity-80 mb-1">ETD</div>
              <div className="text-3xl font-bold">Fri · 18:00</div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <div className="text-2xl font-bold mb-2">🇬🇧 Leeds ➝ 🇲🇼 Lilongwe</div>
            <div className="flex gap-8 text-sm">
              <span>Intake</span>
              <span className="opacity-60">Customs</span>
              <span className="opacity-60">Delivery</span>
            </div>
            <div className="mt-4 text-sm opacity-90">
              Dispatch every Friday, pickups Monday & Wednesday. WhatsApp +265 997 948 857 for status pulses.
            </div>
          </div>

          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-sm">
            £7.5 / kg econ +£12 priority slot · Insurance £6
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What this corridor includes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From cart to collected parcel, every touchpoint is scripted. Drop your UK deliveries at our Leeds hubs, and we orchestrate consolidation, customs, and the last kilometre with obsessive transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Intake */}
          <div>
            <div className="text-sm text-gray-500 mb-2">01 · Intake</div>
            <h3 className="text-2xl font-bold mb-4">Shop & stage</h3>
            <p className="text-gray-600 mb-6">
              Use 24 Hilton Rd or 35 Foxhill Ct as your shipping address. We scan, photograph, and log every box within minutes.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Unlimited retailer deliveries</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>No consolidation fee</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Instant WhatsApp receipt</span>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <div className="text-sm text-gray-500 mb-2">02 · Compliance</div>
            <h3 className="text-2xl font-bold mb-4">Duty handled</h3>
            <p className="text-gray-600 mb-6">
              We model HS codes, apply flat admin (MK 5,000 / MK 15,000), and prep customs clearance before the plane leaves.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Automated valuation engine</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Live quote against parcel weight</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>GBP or MWK invoicing</span>
              </li>
            </ul>
          </div>

          {/* Delivery */}
          <div>
            <div className="text-sm text-gray-500 mb-2">03 · Delivery</div>
            <h3 className="text-2xl font-bold mb-4">Home or hub</h3>
            <p className="text-gray-600 mb-6">
              Pick up in Lilongwe CBD, Blantyre Ginnery Corner, or request premium home delivery with crew ETA tracking.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Dispatch notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Bike + van partners</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Optional insurance & priority</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Flight Slate */}
      <section id="flights" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Flight slate</h2>
            <p className="text-xl text-gray-600">
              We treat every Friday dispatch like a product launch. Peek at the upcoming departures and reserve space before the manifest locks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Next Flight */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
              <div className="text-sm text-blue-600 font-medium mb-4">Next flight</div>
              <div className="text-2xl font-bold mb-2">18:00 · Friday</div>
              <div className="text-lg mb-4">Leeds ➝ Lilongwe</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-medium">78% · 320kg free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cut-off</span>
                  <span className="font-medium">Thursday 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Onward pickups</span>
                  <span className="font-medium">Monday</span>
                </div>
              </div>
            </div>

            {/* Overflow */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 font-medium mb-4">Overflow</div>
              <div className="text-2xl font-bold mb-2">Charter boost</div>
              <div className="text-lg mb-4">Leeds ➝ Blantyre</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>+£1.2/kg surcharge</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Ideal for bulk inventory</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Customs escorted</span>
                </div>
              </div>
            </div>

            {/* Ground Reality */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-sm text-gray-500 font-medium mb-4">Ground reality</div>
              <div className="text-2xl font-bold mb-2">2 pickup nodes</div>
              <div className="text-lg mb-4">City Centre · Ginnery Corner</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Home delivery add-on £9</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>WhatsApp scheduling bot</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Cash or transfer accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Transparent pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a lane, not a mystery surcharge. Duty + customs included. Spare parts admin MK 15,000. We flag edge cases before you pay.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-sm text-gray-500 mb-2">0 – 5kg</div>
            <div className="text-3xl font-bold mb-4">£45 <span className="text-lg font-normal text-gray-500">flat</span></div>
            <p className="text-sm text-gray-600">
              Perfect for sneaker drops, accessories, compact gadgets.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-sm text-gray-500 mb-2">5 – 10kg</div>
            <div className="text-3xl font-bold mb-4">£82 <span className="text-lg font-normal text-gray-500">flat</span></div>
            <p className="text-sm text-gray-600">
              Mixed apparel hauls and homewares land in one bundle.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-sm text-gray-500 mb-2">10 – 20kg</div>
            <div className="text-3xl font-bold mb-4">£8.30 <span className="text-lg font-normal text-gray-500">/ kg</span></div>
            <p className="text-sm text-gray-600">
              Level up with electronics or bulk beauty inventory.
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="text-sm text-blue-600 mb-2">20kg+</div>
            <div className="text-3xl font-bold mb-4">£7.50 <span className="text-lg font-normal text-gray-600">/ kg</span></div>
            <p className="text-sm text-gray-600">
              Best value for resellers & community pooling.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Add-ons: Priority slot £12 · Insurance £6 · Premium home delivery £9 (Lilongwe) / £11 (Blantyre).
        </div>
      </section>

      {/* Automation Spotlight */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Automation spotlight</h2>
            <p className="text-xl text-gray-400">
              Order orchestration that works while you sleep.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-blue-400 mt-1" />
                  <span>Instant intake numbers for every parcel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-blue-400 mt-1" />
                  <span>Auto-handled customs paperwork and HS codes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-blue-400 mt-1" />
                  <span>Smart routing to Lilongwe / Blantyre with ETAs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Bot className="w-5 h-5 text-blue-400 mt-1" />
                  <span>Payment links triggered once weight is confirmed.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border-l-4 border-blue-400">
                <div className="text-sm text-gray-400 mb-1">1</div>
                <div>Parcel lands at Leeds hub • automated photograph + weight capture.</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border-l-4 border-blue-400">
                <div className="text-sm text-gray-400 mb-1">2</div>
                <div>Consolidation window closes • SMS sent with draft invoice.</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border-l-4 border-blue-400">
                <div className="text-sm text-gray-400 mb-1">3</div>
                <div>Flight departs to Malawi • customs pre-clearance initiated.</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border-l-4 border-blue-400">
                <div className="text-sm text-gray-400 mb-1">4</div>
                <div>Ready for pickup • WhatsApp bot schedules delivery slot.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Automated order desk</h2>
          <p className="text-xl text-gray-600">
            Share your parcel details and get an instant estimate. We'll email you a consolidation ID and prep customs forms immediately.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full name</label>
                <input
                  type="text"
                  placeholder="Chimwemwe Banda"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp / Phone</label>
                <input
                  type="tel"
                  placeholder="+265 997 948 857"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Parcel description</label>
                <input
                  type="text"
                  placeholder="3x sneakers, 1x tablet"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total weight (kg)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Delivery preference</label>
                <select
                  value={formData.delivery}
                  onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="collect-lilongwe">Collect at Lilongwe office</option>
                  <option value="collect-blantyre">Collect at Blantyre office</option>
                  <option value="home-lilongwe">Home delivery (Lilongwe)</option>
                  <option value="home-blantyre">Home delivery (Blantyre)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Priority flight slot (+£12)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.insurance}
                    onChange={(e) => setFormData({ ...formData, insurance: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Enhanced insurance (+£6)</span>
                </label>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Generate Quote
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-6">Live summary</h3>

            {price ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base shipping ({formData.weight}kg)</span>
                    <span className="font-medium">£{price.base.toFixed(2)}</span>
                  </div>
                  {price.priority > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Priority slot</span>
                      <span className="font-medium">£{price.priority.toFixed(2)}</span>
                    </div>
                  )}
                  {price.insurance > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">£{price.insurance.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">£{price.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Proceed to Payment
                  </button>
                  <button className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Send to WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Awaiting your form...</p>
                <p className="text-sm mt-2">Share your parcel details to see the automation kick in.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Contact us</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="font-bold mb-4">Phone</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+447756168494" className="hover:text-blue-600">+44 7756 168 494</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+265997948857" className="hover:text-blue-600">+265 997 948 857</a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Email</h3>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:budgetcargomw@gmail.com" className="hover:text-blue-600">budgetcargomw@gmail.com</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Social</h3>
              <div className="space-y-2 text-sm">
                <div>@budget_cargo</div>
                <div className="text-gray-600">#YouShopItWeShipIt</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-4">UK drop-off</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>24 Hilton Road, Chapel Allerton, Leeds LS8 4HA</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>35 Foxhill Court, Weetwood Lane, Leeds LS16 5PN</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Malawi pickup</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>City Centre, Lilongwe • Opposite Reserve Bank</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Ginnery Corner, Blantyre • Cargo Wing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <div className="mb-2">Corridor OS · BudgetCargo</div>
          <div>Rewriting UK-Malawi logistics, one parcel at a time.</div>
        </div>
      </footer>
    </div>
  );
}