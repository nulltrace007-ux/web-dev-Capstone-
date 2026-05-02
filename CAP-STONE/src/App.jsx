import { useEffect, useMemo, useState } from 'react'
import './App.css'
import worldMap from './assets/world-map.svg'

const attackTypes = ['DDoS', 'Malware', 'Brute Force', 'Phishing', 'Ransomware']
const countryList = ['USA', 'India', 'China', 'UK', 'Germany', 'Brazil', 'Australia', 'Canada']
const attackVectors = ['HTTP Flood', 'Trojan', 'SSH Bruteforce', 'Credential Harvest', 'Data Exfiltration']
const statusOptions = ['Blocked', 'Active', 'Mitigated', 'Investigating']
const severityOptions = ['Critical', 'High', 'Medium', 'Low']

const initialEvents = [
  {
    id: 1,
    source: 'China',
    target: 'UK',
    type: 'Malware',
    vector: 'Trojan',
    severity: 'High',
    sourceIp: '203.56.72.19',
    destinationIp: '51.105.42.110',
    status: 'Blocked',
    description: 'Malware payload detected and quarantined during inbound session.',
    time: new Date(Date.now() - 560000),
  },
  {
    id: 2,
    source: 'USA',
    target: 'India',
    type: 'DDoS',
    vector: 'HTTP Flood',
    severity: 'Critical',
    sourceIp: '198.51.100.24',
    destinationIp: '103.22.11.89',
    status: 'Active',
    description: 'High-volume request surge overwhelming the web gateway.',
    time: new Date(Date.now() - 420000),
  },
  {
    id: 3,
    source: 'Russia',
    target: 'Germany',
    type: 'Brute Force',
    vector: 'SSH Bruteforce',
    severity: 'Medium',
    sourceIp: '185.199.108.45',
    destinationIp: '93.184.216.34',
    status: 'Investigating',
    description: 'Repeated login attempts detected across remote access points.',
    time: new Date(Date.now() - 310000),
  },
  {
    id: 4,
    source: 'Brazil',
    target: 'Canada',
    type: 'Phishing',
    vector: 'Credential Harvest',
    severity: 'High',
    sourceIp: '200.98.154.12',
    destinationIp: '142.250.190.78',
    status: 'Blocked',
    description: 'Suspicious email attachments blocked by gateway controls.',
    time: new Date(Date.now() - 210000),
  },
  {
    id: 5,
    source: 'Australia',
    target: 'USA',
    type: 'Ransomware',
    vector: 'Data Exfiltration',
    severity: 'Critical',
    sourceIp: '103.57.182.23',
    destinationIp: '192.0.2.88',
    status: 'Mitigated',
    description: 'Encrypted files blocked before leaving the network.',
    time: new Date(Date.now() - 120000),
  },
]

const mapPoints = [
  { country: 'USA', left: '14%', top: '40%' },
  { country: 'India', left: '67%', top: '54%' },
  { country: 'China', left: '75%', top: '40%' },
  { country: 'UK', left: '42%', top: '28%' },
  { country: 'Germany', left: '47%', top: '31%' },
  { country: 'Brazil', left: '30%', top: '60%' },
  { country: 'Australia', left: '84%', top: '72%' },
]

const getRandomItem = (list) => list[Math.floor(Math.random() * list.length)]
const randomIp = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')

// this function creates the random events
const createRandomEvent = () => {
  const source = getRandomItem(countryList)
  let target = getRandomItem(countryList)
  while (target === source) {
    target = getRandomItem(countryList)
  }

  const type = getRandomItem(attackTypes)
  const vector = getRandomItem(attackVectors)
  const severity = getRandomItem(severityOptions)
  const status = getRandomItem(statusOptions)

  const descriptions = {
    DDoS: 'High-volume traffic spikes detected across web services.',
    Malware: 'Malware signature matched during endpoint analysis.',
    'Brute Force': 'Multiple unauthorized login attempts observed.',
    Phishing: 'Suspicious phishing campaign blocked by filters.',
    Ransomware: 'Encrypted traffic blocked before outbound transfer.',
  }

  return {
    id: Date.now(),
    source,
    target,
    type,
    vector,
    severity,
    sourceIp: randomIp(),
    destinationIp: randomIp(),
    status,
    description: descriptions[type],
    time: new Date(),
  }
}

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const attackDetails = {
  DDoS: {
    title: 'DDoS Attack',
    description: 'DDoS stands for Distributed Denial of Service. It is a type of cyber attack where multiple compromised systems are used to flood a target with traffic, making it unavailable to users. This can cause the websites to crash or slow down significantly.',
    howItWorks: 'Attackers use botnets, which are networks of infected devices, to send massive amounts of traffic to the target server. This overwhelms the server resources, leading to downtime.',
    impact: 'Can cause financial losses, reputational damage, and disruption of services. For example, online banking or e-commerce sites can lose customers during an attack.',
    mitigation: 'Use firewalls, rate limiting, and services like Cloudflare or Akamai to absorb the traffic. Also, monitor for unusual traffic patterns.',
  },
  Malware: {
    title: 'Malware Attack',
    description: 'Malware is malicious software designed to harm or exploit devices. It includes viruses, worms, trojans, and spyware. Malware can steal data, damage files, or give the attackers control over your system.',
    howItWorks: 'Malware spreads through infected downloads, email attachments, or malicious websites. Once installed, it can execute harmful actions like encrypting files or spying on users.',
    impact: 'Data theft, system corruption, and potential for further attacks. It can lead to identity theft or financial fraud.',
    mitigation: 'Install antivirus software, keep systems updated, and avoid clicking suspicious links. Regular backups are also important.',
  },
  'Brute Force': {
    title: 'Brute Force Attack',
    description: 'Brute force is a method where attackers try many passwords or keys to gain access to a system. It is simple but can be effective if the passwords are weak.',
    howItWorks: 'Automated tools try combinations of usernames and passwords until they find the correct one. This can take time but is effective against weak credentials.',
    impact: 'Unauthorized access to accounts, data breaches, and potential for further exploitation.',
    mitigation: 'Use strong, complex passwords, enable two-factor authentication, and implement account lockouts after failed attempts.',
  },
  Phishing: {
    title: 'Phishing Attack',
    description: 'Phishing is a scam where attackers trick people into giving the sensitive information like passwords or credit card numbers. It often comes in the form of fake emails or websites.',
    howItWorks: 'Attackers send deceptive messages that look legitimate, urging users to click links or provide information. The links lead to fake sites that capture data.',
    impact: 'Identity theft, financial loss, and compromised accounts. It can lead to larger breaches if credentials are used elsewhere.',
    mitigation: 'Verify sender identities, avoid clicking unknown links, and use email filters. Educate users about recognizing phishing attempts.',
  },
  Ransomware: {
    title: 'Ransomware Attack',
    description: 'Ransomware is malware that encrypts files and demands payment for decryption. It can lock the users out of their data until they pay the ransom.',
    howItWorks: 'The malware infects systems, encrypts files, and displays a ransom note. Attackers demand payment, usually in cryptocurrency.',
    impact: 'Data loss, operational disruption, and financial costs. Organizations may lose access to critical files.',
    mitigation: 'Regular backups, antivirus software, and employee training. Avoid opening suspicious attachments and keep software updated.',
  },
}

function App() {
  const [events, setEvents] = useState(initialEvents)
  const [attackType, setAttackType] = useState('All')
  const [countryFilter, setCountryFilter] = useState('All')
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [sortKey, setSortKey] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [selectedAttack, setSelectedAttack] = useState('DDoS')
  const [otxData, setOtxData] = useState([])
  const [otxStatus, setOtxStatus] = useState('pending')

  useEffect(() => {
    const fetchOtxData = async () => {
      try {
        console.log('fetching the data')
        const response = await fetch('https://otx.alienvault.com/api/v1/pulses/subscribed', {
          headers: {
            'X-OTX-API-KEY': '8a159d9afda88d1d11cd692c04af8fb7f5606e22034d0576f4ddbf81758b751a',
          },
        })
        const data = await response.json()
        setOtxData(data.results || [])
        setOtxStatus('live')
      } catch (error) {
        console.error('Error fetching OTX data:', error)
        setOtxStatus('error')
      }
    }

    fetchOtxData()
    const timer = window.setInterval(() => {
      fetchOtxData()
      setEvents((prev) => [createRandomEvent(), ...prev].slice(0, 12))
      setLastRefresh(new Date())
    }, 8000)
    return () => window.clearInterval(timer)
  }, [])

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const matchesType = attackType === 'All' || event.type === attackType
        const matchesCountry =
          countryFilter === 'All' || event.source === countryFilter || event.target === countryFilter
        const query = searchQuery.trim().toLowerCase()
        const matchesSearch =
          !query ||
          event.source.toLowerCase().includes(query) ||
          event.target.toLowerCase().includes(query) ||
          event.type.toLowerCase().includes(query) ||
          event.vector.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        return matchesType && matchesCountry && matchesSearch
      })
      .slice()
      .sort((a, b) => {
        if (sortKey === 'newest') return b.time - a.time
        if (sortKey === 'oldest') return a.time - b.time
        if (sortKey === 'source') return a.source.localeCompare(b.source)
        if (sortKey === 'target') return a.target.localeCompare(b.target)
        return 0
      })
  }, [events, attackType, countryFilter, searchQuery, sortKey])

  const blockedCount = filteredEvents.filter((event) => event.status === 'Blocked').length
  const highSeverityCount = filteredEvents.filter((event) => event.severity === 'Critical' || event.severity === 'High').length

  const mostTargetedCountry = useMemo(() => {
    const counts = filteredEvents.reduce((acc, event) => {
      acc[event.target] = (acc[event.target] || 0) + 1
      return acc
    }, {})
    const topCountry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return topCountry ? `${topCountry[0]} (${topCountry[1]})` : '—'
  }, [filteredEvents])

  const mostCommonAttack = useMemo(() => {
    const counts = filteredEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {})
    const topType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return topType ? `${topType[0]} (${topType[1]})` : '—'
  }, [filteredEvents])

  const chartData = attackTypes.map((type) => {
    const count = filteredEvents.filter((event) => event.type === type).length
    return { type, count, percent: filteredEvents.length ? Math.round((count / filteredEvents.length) * 100) : 0 }
  })

  const targetRanking = useMemo(() => {
    return Object.entries(
      filteredEvents.reduce((acc, event) => {
        acc[event.target] = (acc[event.target] || 0) + 1
        return acc
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [filteredEvents])

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">🛡️</span>
          <div>
            <p className="eyebrow">Cyber-security Dashboard</p>
            <h1>Cyber Attack Monitoring</h1>
          </div>
        </div>

        <div className="navbar-actions">
          <button className="mode-toggle" onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </header>

      <section className="summary-strip">
        <article className="summary-card">
          <p className="summary-label">Active alerts</p>
          <p className="summary-value">{filteredEvents.length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Blocked attacks</p>
          <p className="summary-value">{blockedCount}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">High severity</p>
          <p className="summary-value">{highSeverityCount}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Last refresh</p>
          <p className="summary-value">{formatTime(lastRefresh)}</p>
        </article>
      </section>

      <main className="dashboard-shell">
        <section className="map-panel">
          <article className="card map-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">World Map</p>
                <h2>Live attack zones</h2>
              </div>
              <button
                className="refresh-button"
                onClick={() => {
                  setEvents((prev) => [createRandomEvent(), ...prev].slice(0, 12))
                  setLastRefresh(new Date())
                }}
              >
                Manual refresh
              </button>
            </div>
            <div className="map-viewport">
              <img className="map-image" src={worldMap} alt="World map" />
              {mapPoints.map((point) => (
                <button
                  key={point.country}
                  type="button"
                  className={`map-dot ${countryFilter === point.country ? 'active' : ''}`}
                  style={{ left: point.left, top: point.top }}
                  onClick={() => {
                    setCountryFilter(point.country)
                    setSelectedCountry(point.country)
                  }}
                >
                  {point.country}
                </button>
              ))}
              <div className="map-path path-1" />
              <div className="map-path path-2" />
              <div className="map-path path-3" />
            </div>
            <div className="map-footer">
              <span>Active nodes: {mapPoints.length}</span>
              <span>Recent breach: {filteredEvents[0]?.target ?? 'N/A'}</span>
            </div>
            <div className="map-hint">
              <div>
                <span>Selected region:</span>
                <strong>{selectedCountry === 'All' ? 'Global' : selectedCountry}</strong>
              </div>
              <div className="hint-actions">
                <button type="button" className="clear-map-filter" onClick={() => {
                  setCountryFilter('All')
                  setSelectedCountry('All')
                }}>
                  Clear map filter
                </button>
                <span className={`otx-status ${otxStatus}`}>{otxStatus === 'live' ? `OTX live (${otxData.length} pulses)` : otxStatus === 'error' ? 'OTX fetch failed' : 'OTX loading...'}</span>
              </div>
            </div>
          </article>
        </section>

        <section className="feed-panel">
          <article className="card feed-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Live Feed</p>
                <h2>Attack stream</h2>
              </div>
            </div>

            <div className="feed-controls">
              <label>
                Search
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search source, target, or attack"
                />
              </label>
              <label>
                Attack type
                <select value={attackType} onChange={(e) => setAttackType(e.target.value)}>
                  <option>All</option>
                  {attackTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Country
                <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
                  <option>All</option>
                  {countryList.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </label>
              <label>
                Sort
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="source">Source A-Z</option>
                  <option value="target">Target A-Z</option>
                </select>
              </label>
            </div>

            <div className="feed-list">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div key={event.id} className="feed-row">
                    <div className="feed-main">
                      <div className="feed-title">
                        <strong>{event.source}</strong>
                        <span>→</span>
                        <strong>{event.target}</strong>
                      </div>
                      <p>{event.description}</p>
                    </div>
                    <div className="feed-meta">
                      <span className={`badge badge-${event.severity.toLowerCase()}`}>{event.severity}</span>
                      <span className="pill">{event.type}</span>
                      <span className="pill">{event.vector}</span>
                    </div>
                    <div className="feed-info">
                      <div>{event.sourceIp}</div>
                      <div>{event.destinationIp}</div>
                      <div className="status-row">
                        <span className={`status-dot status-dot-${event.status.toLowerCase()}`}></span>
                        <span>{event.status}</span>
                      </div>
                      <time>{formatTime(event.time)}</time>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No attacks match the selected filters.</div>
              )}
            </div>
          </article>

          <article className="card targets-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Top Targets</p>
                <h2>Most attacked countries</h2>
              </div>
            </div>
            <div className="top-targets">
              {targetRanking.length > 0 ? (
                targetRanking.map(([country, count]) => (
                  <div key={country} className="target-row">
                    <span>{country}</span>
                    <span>{count} attacks</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">No country data available.</div>
              )}
            </div>
          </article>
        </section>

        <section className="details-panel">
          <article className="card details-card">
            <div className="card-header">
              <div>
                <p className="eyebrow">Attack Details</p>
                <h2>{attackDetails[selectedAttack]?.title || 'Select an Attack'}</h2>
              </div>
            </div>
            <div className="attack-selector">
              {attackTypes.map((type) => (
                <button
                  key={type}
                  className={`attack-btn ${selectedAttack === type ? 'active' : ''}`}
                  onClick={() => setSelectedAttack(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            {attackDetails[selectedAttack] && (
              <div className="attack-info">
                <h3>What is it?</h3>
                <p>{attackDetails[selectedAttack].description}</p>
                <h3>How it works</h3>
                <p>{attackDetails[selectedAttack].howItWorks}</p>
                <h3>Impact</h3>
                <p>{attackDetails[selectedAttack].impact}</p>
                <h3>Mitigation</h3>
                <p>{attackDetails[selectedAttack].mitigation}</p>
              </div>
            )}
          </article>
        </section>
      </main>

      <section className="bottom-grid">
        <article className="card stats-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Summary</p>
              <h2>Threat insights</h2>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-box">
              <p className="stat-label">Total events</p>
              <p className="stat-value">{events.length}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Displayed events</p>
              <p className="stat-value">{filteredEvents.length}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Most targeted country</p>
              <p className="stat-value">{mostTargetedCountry}</p>
            </div>
            <div className="stat-box">
              <p className="stat-label">Most common attack</p>
              <p className="stat-value">{mostCommonAttack}</p>
            </div>
          </div>
        </article>

        <article className="card chart-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Chart</p>
              <h2>Attack type breakdown</h2>
            </div>
          </div>
          <div className="bar-chart">
            {chartData.map((item) => (
              <div key={item.type} className="bar-row">
                <span>{item.type}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${item.percent}%` }} />
                </div>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card risk-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Risk score</p>
              <h2>Severity breakdown</h2>
            </div>
          </div>
          <div className="risk-grid">
            {severityOptions.map((level) => (
              <div key={level} className="risk-row">
                <span>{level}</span>
                <span>{filteredEvents.filter((event) => event.severity === level).length}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer className="footer-note">
        Simulated attack data for demo purposes and dashboard presentation.
      </footer>
    </div>
  )
}

export default App

