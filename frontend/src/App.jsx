import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import {
  AlertTriangle,
  Archive,
  Baby,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Copy,
  Database,
  Download,
  Eye,
  FileText,
  Globe2,
  HeartHandshake,
  Home,
  Languages,
  MapPin,
  Package,
  Plus,
  RefreshCcw,
  Send,
  Settings,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'
import { api } from './lib/api'
import { cases as fallbackCases, demoAnalysis, demoCase, demoIntake, inventory as fallbackInventory, publicNeeds, shelter } from './lib/demoData'

const nav = [
  ['/', 'Command', Home],
  ['/intake', 'Intake', Users],
  ['/cases', 'Cases', ClipboardList],
  ['/inventory', 'Inventory', Archive],
  ['/needs', 'Needs Board', Package],
  ['/public-needs/demo-shelter', 'Public View', Eye],
  ['/exports', 'Exports', Download],
  ['/settings', 'Settings', Settings],
  ['/about-demo', 'About Demo', BarChart3],
]

const priorityClasses = {
  critical: 'border-red-200 bg-red-50 text-red-700',
  high: 'border-orange-200 bg-orange-50 text-orange-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  low: 'border-slate-200 bg-slate-50 text-slate-700',
  open: 'border-blue-200 bg-blue-50 text-blue-800',
}

function Badge({ children, tone = 'low' }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${priorityClasses[tone] || priorityClasses.low}`}>{children}</span>
}

function Card({ children, className = '' }) {
  return <section className={`rounded-lg border border-slate-200 bg-white ${className}`}>{children}</section>
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = variant === 'primary'
    ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
    : variant === 'ghost'
      ? 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100'
      : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
  return <button className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${styles} ${className}`} {...props}>{children}</button>
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#fbf8fa] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] border-r border-slate-200 bg-[#fbf8fa] p-5 lg:block">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-900 p-2 text-white"><Shield size={20} /></div>
          <div>
            <div className="text-xl font-bold leading-tight">ShelterOps Gemma</div>
            <div className="text-sm text-slate-600">Local-First Coordination</div>
          </div>
        </Link>
        <Link to="/intake" className="mt-10 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white"><Plus size={18} /> New Intake</Link>
        <nav className="mt-8 space-y-1">
          {nav.slice(1).map(([href, label, Icon]) => (
            <NavLink key={href} to={href} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${isActive ? 'border-r-4 border-slate-950 bg-slate-100 text-slate-950' : 'text-slate-700 hover:bg-slate-100'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-[240px]">
        <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-slate-200 bg-[#fbf8fa]/95 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3 text-sm font-semibold"><MapPin size={17} /> {shelter.name}</div>
          <div className="flex items-center gap-3">
            <Badge tone="open">Local Mode</Badge>
            <Badge tone="low">Gemma 4 via Ollama</Badge>
            <Link to="/intake"><Button><Plus size={16} /> New Intake</Button></Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1360px] p-5 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

function PageTitle({ title, subtitle, action }) {
  return <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{title}</h1><p className="mt-2 text-lg text-slate-600">{subtitle}</p></div>{action}</div>
}

function Metric({ label, value, icon: Icon, tone = 'low' }) {
  return <Card className={`p-5 ${tone === 'critical' ? 'border-red-300 bg-red-50' : tone === 'high' ? 'border-orange-200 bg-orange-50' : ''}`}><div className="flex items-start justify-between"><div><div className="text-sm font-semibold tracking-wide">{label}</div><div className="mt-4 text-4xl font-bold">{value}</div></div><Icon className={tone === 'critical' ? 'text-red-700' : 'text-slate-500'} /></div></Card>
}

function DashboardPage() {
  return <Shell><PageTitle title="Emergency Operations Command" subtitle="Live shelter status, action queues, inventory gaps, and public board readiness." action={<Link to="/intake"><Button><Sparkles size={16} /> Load Demo Scenario</Button></Link>} />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Metric label="Open Cases" value="18" icon={ClipboardList} />
      <Metric label="Critical Flags" value="3" icon={AlertTriangle} tone="critical" />
      <Metric label="High Priority" value="7" icon={Shield} tone="high" />
      <Metric label="Public Board" value="Live" icon={Globe2} />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
      <Card className="p-6"><h2 className="text-2xl font-bold">Priority Action Queue</h2><DataTable headers={['Priority', 'Case', 'Zone', 'Top Need', 'Owner']} rows={fallbackCases.map((c) => [<Badge tone={c.priority}>{c.priority}</Badge>, <Link className="mono font-semibold" to={`/cases/${c.id}`}>{c.id}</Link>, c.zone, c.immediate_needs[0], c.priority === 'critical' ? 'Medical Desk' : 'Shelter Lead'])} /></Card>
      <Card className="p-6"><h2 className="flex items-center gap-2 text-2xl font-bold"><Sparkles /> Operations Snapshot</h2><p className="mt-4 text-slate-700">Baby formula, blankets, sleeping mats, and Arabic-speaking volunteers are the most urgent publishable needs. Medical desk review remains internal and private.</p><div className="mt-6 space-y-3">{fallbackInventory.slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-3"><span>{item.item_name}</span><Badge tone={item.priority}>gap {item.gap}</Badge></div>)}</div><Link to="/needs"><Button className="mt-6 w-full"><Package size={16} /> Open Needs Board</Button></Link></Card>
    </div>
  </Shell>
}

function IntakePage() {
  const [form, setForm] = useState({ ...demoIntake, notes: '' })
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  async function analyze() {
    setLoading(true)
    const result = await api.analyze(form)
    setAnalysis(result)
    setLoading(false)
    if (result.warnings?.length) toast.warning(result.warnings[0])
  }
  async function save() {
    const saved = await api.saveCase({ ...form, analysis: analysis || demoAnalysis })
    toast.success('Case saved. Needs board updated.')
    navigate(`/cases/${saved.id || 'CASE-014'}`)
  }
  return <Shell><PageTitle title="New Intake" subtitle="Turn messy field notes into a structured shelter action plan." />
    <div className="grid gap-6 xl:grid-cols-[1.2fr_.85fr]">
      <Card className="p-6"><h2 className="text-2xl font-bold">Household Intake</h2><div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Disaster Type" value={form.disaster_type} onChange={(e) => set('disaster_type', e.target.value)} />
        <Field label="Shelter Zone" value={form.zone} onChange={(e) => set('zone', e.target.value)} />
        <Field label="Household Size" type="number" value={form.household_size} onChange={(e) => set('household_size', Number(e.target.value))} />
        <Field label="Languages" value={form.languages.join(', ')} onChange={(e) => set('languages', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2"><Checklist title="Vulnerable People" values={['Infant', 'elderly', 'chronic illness', 'pregnant', 'disability']} selected={form.vulnerable_people} onChange={(v) => set('vulnerable_people', v)} /><Checklist title="Immediate Needs" values={['Food/Water', 'Blankets', 'Baby formula', 'Medication review', 'Arabic support', 'Sleeping area']} selected={form.immediate_needs} onChange={(v) => set('immediate_needs', v)} /></div>
      <label className="mt-5 block text-sm font-bold">Free-text Field Notes<textarea className="mt-2 min-h-36 w-full rounded-lg border border-slate-300 bg-white p-3" value={form.notes} onChange={(e) => set('notes', e.target.value)} /></label>
      <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="flex min-h-28 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-center text-slate-600">Drop intake paper photo or click to browse</div><label className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm"><input type="checkbox" defaultChecked /> Verbal privacy consent has been obtained for shelter coordination.</label></div>
      <div className="mt-6 flex flex-wrap gap-3"><Button onClick={analyze} disabled={loading}><Sparkles size={16} /> {loading ? 'Analyzing...' : 'Analyze with Gemma 4'}</Button><Button variant="secondary" onClick={() => { setForm(demoIntake); toast.success('Demo scenario loaded') }}>Load Demo Scenario</Button><Button variant="ghost" onClick={() => { setForm({ ...demoIntake, notes: '' }); setAnalysis(null) }}>Clear Form</Button></div></Card>
      <AnalysisPanel analysis={analysis} loading={loading} onSave={save} />
    </div>
  </Shell>
}

function Field({ label, ...props }) {
  return <label className="text-sm font-bold">{label}<input className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 font-normal" {...props} /></label>
}

function Checklist({ title, values, selected, onChange }) {
  function toggle(value) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value])
  }
  return <div><div className="mb-2 text-sm font-bold">{title}</div><div className="space-y-2">{values.map((value) => <label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(value)} onChange={() => toggle(value)} /> {value}</label>)}</div></div>
}

function AnalysisPanel({ analysis, loading, onSave }) {
  const data = analysis || demoAnalysis
  return <Card className="p-6"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-2xl font-bold">Analysis Preview <CheckCircle2 size={20} /></h2><Badge tone={data.priority_recommendation}>High Priority</Badge></div>
    {loading ? <div className="mt-6 space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />)}</div> : <>
      <div className="mt-5 flex items-center gap-4 bg-slate-50 p-5"><div className="grid h-16 w-16 place-items-center rounded-full bg-red-700 text-2xl font-bold text-white">{data.urgency_score}</div><div><div className="font-bold">Urgency Score</div><p className="text-sm text-slate-600">{data.recommended_next_action}</p></div></div>
      <h3 className="mt-6 text-sm font-bold uppercase tracking-wide">Extracted Flags</h3><div className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200">{data.urgency_flags.map((flag) => <div key={flag.label} className="p-4"><Badge tone={flag.level}>{flag.level}</Badge><div className="mt-2 font-bold">{flag.label}</div><p className="text-sm text-slate-600">{flag.reason}</p></div>)}</div>
      <h3 className="mt-6 text-sm font-bold uppercase tracking-wide">Recommended Action</h3><div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">{data.handoff}</div>
      <div className="mt-6 flex gap-3"><Button onClick={onSave}>Save Case & Update Needs Board</Button><Link to="/cases/CASE-014"><Button variant="secondary">View Full Case</Button></Link><Button variant="secondary" onClick={() => navigator.clipboard?.writeText(data.handoff)}><Copy size={16} /></Button></div>
    </>}
  </Card>
}

function CasesPage() {
  return <Shell><PageTitle title="Cases" subtitle="Monitor open shelter cases, urgency flags, and action status." />
    <div className="grid gap-4 md:grid-cols-5"><Metric label="Open Cases" value="18" icon={ClipboardList} /><Metric label="Critical" value="3" icon={AlertTriangle} tone="critical" /><Metric label="High Priority" value="7" icon={Shield} tone="high" /><Metric label="Medical Escalations" value="4" icon={HeartHandshake} /><Metric label="Translation Needs" value="6" icon={Languages} /></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.7fr]"><Card className="p-6"><h2 className="text-2xl font-bold">Active Cases Roster</h2><DataTable headers={['Priority', 'Case ID', 'Zone', 'Household', 'Top Need', 'Language', 'Action']} rows={fallbackCases.map((c) => [<Badge tone={c.priority}>{c.priority}</Badge>, <span className="mono">{c.id}</span>, c.zone, `${c.household_size} people`, c.immediate_needs[0], c.languages[0], <Link className="font-semibold text-slate-900 underline" to={`/cases/${c.id}`}>Review</Link>])} /></Card><Card className="p-6"><h2 className="text-2xl font-bold">Current Operations Snapshot</h2><p className="mt-4 text-slate-700">Top common needs are blankets, baby formula, and Arabic translation support.</p><Link to="/needs"><Button className="mt-6 w-full"><Package size={16} /> Open Needs Board</Button></Link></Card></div>
  </Shell>
}

function CaseDetailPage() {
  const { id = 'CASE-014' } = useParams()
  const c = fallbackCases.find((item) => item.id === id) || demoCase
  return <Shell><PageTitle title={`Case ${c.id}`} subtitle="Generated shelter plan and action queue." action={<div className="flex gap-2"><Button variant="secondary"><Copy size={16} /> Copy Handoff</Button><Button variant="secondary"><Download size={16} /> Export Case</Button><Button><CheckCircle2 size={16} /> Mark Resolved</Button></div>} />
    <div className="grid gap-5 xl:grid-cols-[.7fr_1.5fr]"><Card className="border-red-200 p-6"><Badge tone={c.priority}>{c.priority} priority</Badge><div className="mt-4 text-sm text-slate-600">Score <span className="mono font-bold">{c.urgency_score}</span></div><p className="mt-4 text-lg">Multiple vulnerabilities flagged during intake. Immediate medical and logistical attention required.</p></Card><Card className="p-6"><h2 className="text-2xl font-bold">Household Summary</h2><div className="mt-5 grid gap-4 md:grid-cols-4"><Info label="Incident" value={c.disaster_type} /><Info label="Location" value={c.zone} /><Info label="Primary Lang" value={c.languages[0]} /><Info label="Size" value={c.household_size} /></div></Card></div>
    <Card className="mt-5 flex items-center justify-between p-5"><div className="flex items-center gap-4"><div className="rounded-full bg-slate-900 p-3 text-white"><Shield /></div><div><div className="font-bold">Privacy Filter Active</div><p className="text-sm text-slate-600">PII has been masked for shared views. Grounding sources verified against protocol docs.</p></div></div><Link to="/settings">Manage Settings</Link></Card>
    <Card className="mt-5 p-0"><Tabs sections={{ 'Action Queue': <DataTable headers={['Task', 'Priority', 'Team', 'Status']} rows={c.action_tasks.map((task) => [task.task, <Badge tone={task.priority}>{task.priority}</Badge>, task.team, task.status])} />, Supplies: <DataTable headers={['Item', 'Qty', 'Priority', 'Public']} rows={c.supply_request.map((s) => [s.item_name, s.quantity, <Badge tone={s.priority}>{s.priority}</Badge>, s.public_shareable ? 'Yes' : 'No'])} />, Handoff: <TextBlock text={c.handoff} />, Translation: <TextBlock text={c.translated_instructions} />, 'Safety & Grounding': <TextBlock text={`${c.safety_notes.join('\n')}\n\nSources: ${c.grounding_sources.join(', ')}`} /> }} /></Card>
  </Shell>
}

function InventoryPage() {
  return <Shell><PageTitle title="Inventory" subtitle="Track shelter stock and real-time gaps from active cases." action={<Button variant="secondary"><Download size={16} /> Export CSV</Button>} />
    <div className="grid gap-4 md:grid-cols-4"><Metric label="Critical Gaps" value="4" icon={AlertTriangle} tone="critical" /><Metric label="Items Needed" value="126" icon={Package} /><Metric label="Items In Stock" value="84" icon={Archive} /><Metric label="Volunteer Roles" value="7" icon={Users} /></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.7fr]"><Card className="p-6"><h2 className="text-2xl font-bold">Current Inventory Status</h2><DataTable headers={['Item', 'Category', 'In Stock', 'Needed', 'Gap', 'Priority', 'Visibility']} rows={fallbackInventory.map((i) => [i.item_name, i.category, i.in_stock, i.needed, <span className="font-bold text-red-700">-{i.gap}</span>, <Badge tone={i.priority}>{i.priority}</Badge>, i.public_shareable ? <Globe2 size={18} /> : <Shield size={18} />])} /></Card><Card className="p-6"><h2 className="flex items-center gap-2 text-2xl font-bold"><Sparkles /> AI Insights</h2><p className="mt-4 text-slate-700">Baby formula shortage is the most critical public need. Arabic volunteers and blanket reserves should be published immediately.</p><div className="mt-6 border-l-4 border-slate-900 bg-slate-50 p-4 text-sm"><b>Recommendation</b><br />Escalate formula and volunteer requests to the public needs board.</div><Link to="/public-needs/demo-shelter"><Button className="mt-6 w-full">Open Public Needs Board</Button></Link></Card></div>
  </Shell>
}

function NeedsPage() {
  const [message, setMessage] = useState('')
  async function generate() {
    const result = await api.export('whatsapp_callout')
    setMessage(result.content)
    toast.success('Volunteer request generated')
  }
  return <Shell><PageTitle title="Needs Board" subtitle="Aggregate real shelter needs and generate privacy-safe external requests." action={<Button onClick={() => toast.success('Public board published')}><Send size={16} /> Publish Public Board</Button>} />
    <div className="grid gap-4 lg:grid-cols-3">{publicNeeds.slice(0, 3).map((need) => <Card key={need.need} className={`p-6 ${need.priority === 'critical' ? 'border-red-300' : ''}`}><div className="flex justify-between"><h2 className="text-2xl font-bold">{need.need}</h2><Badge tone={need.priority}>{need.priority}</Badge></div><div className="mt-6 text-5xl font-bold">{need.quantity}<span className="ml-2 text-base font-normal">units requested</span></div></Card>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_.9fr]"><Card className="p-6"><h2 className="text-2xl font-bold">Aggregated Needs</h2><DataTable headers={['Priority', 'Need', 'Category', 'Qty', 'Public']} rows={publicNeeds.map((n) => [<Badge tone={n.priority}>{n.priority}</Badge>, n.need, n.category, n.quantity, 'Yes'])} /></Card><Card className="p-6"><h2 className="text-2xl font-bold">External Request</h2><p className="mt-2 text-sm text-slate-600">Privacy filter removes case details, medical conditions, names, and raw notes.</p><textarea className="mt-4 min-h-48 w-full rounded-lg border border-slate-300 p-3" value={message} readOnly placeholder="Generate a volunteer callout..." /><div className="mt-4 flex gap-3"><Button onClick={generate}><Sparkles size={16} /> Generate Volunteer Request</Button><Button variant="secondary" onClick={() => { navigator.clipboard?.writeText(message); toast.success('Copied') }}><Copy size={16} /> Copy</Button></div></Card></div>
  </Shell>
}

function PublicNeedsPage() {
  return <div className="min-h-screen bg-[#fbf8fa] p-5 text-slate-950 lg:p-8"><header className="flex items-center justify-between border-b border-slate-200 pb-5"><div className="flex items-center gap-3 text-2xl font-bold"><HeartHandshake /> ShelterOps Gemma</div><Button><Send size={16} /> Share Needs</Button></header><main className="mx-auto mt-8 max-w-[1320px]"><div className="rounded-lg bg-red-100 p-6 text-red-800"><h1 className="flex items-center gap-3 text-3xl font-bold"><AlertTriangle /> Urgent Shelter Needs</h1><p className="mt-2 text-lg">Most urgent need: baby formula, blankets, and Arabic-speaking volunteers. Drop-offs are accepted at the main entrance.</p></div><div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.7fr]"><Card className="p-0"><div className="flex justify-between border-b border-slate-200 p-5"><h2 className="text-2xl font-bold">Current Needs Board</h2><span>Last updated: 10 mins ago</span></div><DataTable headers={['Priority', 'Need', 'Category', 'Qty Needed', 'How to Help']} rows={publicNeeds.map((n) => [<Badge tone={n.priority}>{n.priority}</Badge>, n.need, n.category, <span className="mono">{n.quantity}</span>, <Button variant={n.how.includes('Sign') ? 'primary' : 'secondary'}>{n.how}</Button>])} /></Card><div className="space-y-5"><Card className="p-6"><h2 className="flex items-center gap-2 text-2xl font-bold"><MapPin /> Drop-off Information</h2><p className="mt-5 font-bold">{shelter.name}</p><p>{shelter.location}, Main entrance</p><p className="mt-4 font-bold">Operating Hours</p><p>8:00 AM - 8:00 PM daily</p><p className="mt-4 font-bold">Contact Coordinator</p><p>{shelter.contact_email}</p></Card><Card className="bg-slate-900 p-6 text-white"><h2 className="text-2xl font-bold">Volunteer Shifts</h2><p className="mt-4">We urgently need general support and language specialists.</p><Button className="mt-5" variant="secondary">View Open Shifts</Button></Card><Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Shield /> Privacy Promise</h2><p className="mt-3 text-sm">This board displays aggregated, anonymized needs. No personal identifying information, medical details, case IDs, or private notes are shared publicly.</p></Card></div></div></main></div>
}

function ExportsPage() {
  const [type, setType] = useState('ngo_email')
  const [content, setContent] = useState('')
  async function generate() {
    const result = await api.export(type)
    setContent(result.content)
    toast.success('Export generated')
  }
  return <Shell><PageTitle title="Exports" subtitle="Generate privacy-safe partner communications and internal handoffs." />
    <Card className="p-6"><div className="grid gap-5 lg:grid-cols-[.4fr_1fr]"><div><label className="text-sm font-bold">Export Type<select className="mt-2 w-full rounded-lg border border-slate-300 p-3" value={type} onChange={(e) => setType(e.target.value)}>{['ngo_email', 'whatsapp_callout', 'csv_gap_report', 'shift_handoff', 'public_needs_snapshot'].map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}</select></label><Button className="mt-4 w-full" onClick={generate}><FileText size={16} /> Generate</Button></div><div><textarea className="min-h-96 w-full rounded-lg border border-slate-300 p-4 mono text-sm" value={content} readOnly placeholder="Export preview..." /><Button className="mt-3" variant="secondary" onClick={() => { navigator.clipboard?.writeText(content); toast.success('Copied') }}><Copy size={16} /> Copy</Button></div></div></Card>
  </Shell>
}

function SettingsPage() {
  return <Shell><PageTitle title="Settings" subtitle="Configure shelter profile, model settings, privacy rules, and demo mode." />
    <div className="grid gap-6 lg:grid-cols-2"><Card className="p-6"><h2 className="text-2xl font-bold">Shelter Profile</h2>{['name', 'location', 'contact_name', 'contact_email', 'dropoff_instructions'].map((key) => <Field key={key} label={key.replaceAll('_', ' ')} defaultValue={shelter[key]} />)}</Card><Card className="p-6"><h2 className="text-2xl font-bold">Model & Privacy</h2><Info label="Runtime" value="Gemma 4 via Ollama" /><Info label="Base URL" value="http://localhost:11434" /><Info label="Fallback" value="Demo mode enabled when model unavailable" /><div className="mt-5 space-y-3"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Privacy Filter On</label><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Human escalation notices</label><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Demo fallback enabled</label></div></Card></div>
  </Shell>
}

function AboutDemoPage() {
  return <Shell><PageTitle title="How ShelterOps Gemma Works" subtitle="Local-first AI coordination for emergency shelters." />
    <Card className="p-6"><h2 className="text-2xl font-bold">System Architecture</h2><div className="mt-8 grid items-center gap-4 md:grid-cols-4">{['Volunteer Intake', 'Local Node Gemma 4 Processing', 'Dashboard & Triage Coordination', 'Public Needs Board'].map((step, idx) => <div key={step} className={`rounded-lg border p-6 text-center ${idx === 1 ? 'bg-slate-900 text-white' : 'bg-slate-50'}`}>{step}</div>)}</div><p className="mt-6 text-slate-700">Data flows from physical intake stations to local processing with Gemma 4, deterministic urgency scoring, local RAG policy grounding, and privacy-filtered public aggregation.</p></Card>
    <div className="mt-5 grid gap-5 lg:grid-cols-4"><InfoCard title="Gemma 4 Usage" icon={Sparkles} text="Structured intake analysis, action tasks, translations, handoffs, and grounded safety notes." /><InfoCard title="Safety Model" icon={Shield} text="No diagnosis. Critical medical risks are escalated to qualified staff, and public views are filtered." /><InfoCard title="Local-First" icon={Database} text="Ollama and demo fallback let the shelter keep working during connectivity failures." /><InfoCard title="Limitations" icon={AlertTriangle} text="Model output requires human review, and local inference quality depends on available hardware." /></div>
  </Shell>
}

function DataTable({ headers, rows }) {
  return <div className="mt-4 overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead><tr className="border-y border-slate-200 bg-slate-50">{headers.map((h) => <th key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i} className="border-b border-slate-200">{row.map((cell, j) => <td key={j} className="px-4 py-4 align-middle">{cell}</td>)}</tr>)}</tbody></table></div>
}

function Info({ label, value }) {
  return <div className="mt-4"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 font-semibold">{value}</div></div>
}

function InfoCard({ title, text, icon: Icon }) {
  return <Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Icon /> {title}</h2><p className="mt-4 text-slate-700">{text}</p></Card>
}

function TextBlock({ text }) {
  return <pre className="whitespace-pre-wrap p-5 text-sm leading-6 text-slate-700">{text}</pre>
}

function Tabs({ sections }) {
  const keys = Object.keys(sections)
  const [active, setActive] = useState(keys[0])
  return <div><div className="flex flex-wrap gap-2 border-b border-slate-200 px-4 pt-4">{keys.map((key) => <button key={key} onClick={() => setActive(key)} className={`border-b-2 px-4 py-3 font-semibold ${active === key ? 'border-slate-900 text-slate-950' : 'border-transparent text-slate-600'}`}>{key}</button>)}</div>{sections[active]}</div>
}

function App() {
  const [health, setHealth] = useState(null)
  useEffect(() => { api.health().then(setHealth) }, [])
  const status = useMemo(() => health?.mode || 'demo', [health])
  return <>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/intake" element={<IntakePage />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/cases/:id" element={<CaseDetailPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/needs" element={<NeedsPage />} />
      <Route path="/public-needs/:shelterId" element={<PublicNeedsPage />} />
      <Route path="/exports" element={<ExportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/about-demo" element={<AboutDemoPage />} />
    </Routes>
    <Toaster richColors position="top-right" />
    <div className="fixed bottom-3 right-3 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">Mode: {status}</div>
  </>
}

export default App
