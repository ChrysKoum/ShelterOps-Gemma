import { cases, demoAnalysis, inventory, publicNeeds, shelter } from './demoData'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function request(path, options = {}, fallback) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch {
    return fallback
  }
}

function fallbackExport(type) {
  if (type === 'csv_gap_report') return 'item,category,gap,priority\nBaby formula,Infant Care,8,critical\nBlankets,Shelter,25,high'
  if (type === 'shift_handoff') return demoAnalysis.handoff
  return 'Northside School Gym needs baby formula, blankets, sleeping mats, Arabic-speaking volunteers, and hygiene kits. Drop off at the main entrance between 8 AM and 8 PM. No private resident details are shared.'
}

export const api = {
  health: () => request('/api/health', {}, { ok: true, mode: 'demo', model: 'gemma4', supabase: { mode: 'memory' } }),
  analyze: (payload) => request('/api/intake/analyze', { method: 'POST', body: JSON.stringify(payload) }, demoAnalysis),
  saveCase: (payload) => request('/api/cases', { method: 'POST', body: JSON.stringify(payload) }, cases[0]),
  cases: () => request('/api/cases', {}, cases),
  caseById: (id) => request(`/api/cases/${id}`, {}, cases.find((item) => item.id === id) || cases[0]),
  inventory: () => request('/api/inventory', {}, inventory),
  needs: () => request('/api/needs', {}, publicNeeds),
  publicNeeds: (id) => request(`/api/public-needs/${id}`, {}, { shelter, needs: publicNeeds, last_updated: '10 mins ago' }),
  publish: () => request('/api/needs/publish', { method: 'POST', body: JSON.stringify({}) }, { published: true }),
  export: (type) => {
    const endpoint = {
      ngo_email: '/api/exports/ngo-email',
      whatsapp_callout: '/api/exports/whatsapp',
      csv_gap_report: '/api/exports/csv',
      shift_handoff: '/api/exports/handoff',
      public_needs_snapshot: '/api/exports/public-snapshot',
    }[type]
    return request(endpoint, { method: 'POST', body: JSON.stringify({ shelter_id: 'demo-shelter' }) }, { export_type: type, content: fallbackExport(type) })
  },
}
