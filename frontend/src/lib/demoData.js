export const shelter = {
  id: 'demo-shelter',
  name: 'Northside School Gym',
  location: '1200 Maple Ave',
  contact_name: 'Maya Chen',
  contact_email: 'shelter-coordinator@example.org',
  contact_phone: '(555) 012-3456',
  dropoff_instructions: 'Main entrance, 8 AM - 8 PM',
}

export const demoIntake = {
  disaster_type: 'Flood',
  zone: 'Gym A',
  household_size: 5,
  languages: ['Arabic'],
  vulnerable_people: ['Infant', 'elderly', 'chronic illness'],
  immediate_needs: ['Baby formula', 'Sleeping area', 'Medication review', 'Arabic support'],
  notes: 'Family of 5 arrived after flood evacuation. Grandmother is diabetic and forgot medication. Baby needs formula. Father lost ID. Family speaks Arabic and needs sleeping area.',
}

export const demoAnalysis = {
  summary: 'Flood evacuation household of 5 needs sleeping placement, infant supplies, Arabic support, and medical desk review for missing diabetes medication.',
  priority_recommendation: 'high',
  urgency_score: 72,
  model_status: 'fallback',
  warnings: ['Fallback demo response used because local model was unavailable.'],
  recommended_next_action: 'Prioritize intake follow-up and assign medical, supplies, and translation tasks.',
  urgency_flags: [
    { label: 'Missing diabetes medication', level: 'critical', reason: 'Medication interruption needs qualified medical review.', public_shareable: false },
    { label: 'Infant formula needed', level: 'high', reason: 'Baby formula requested for infant care.', public_shareable: true },
    { label: 'Arabic language support', level: 'high', reason: 'Family needs Arabic instructions and interpretation.', public_shareable: true },
    { label: 'Lost ID support', level: 'medium', reason: 'Administrative document support requested.', public_shareable: false },
  ],
  action_tasks: [
    { task: 'Refer grandmother to medical desk', priority: 'critical', team: 'Medical Desk', reason: 'Missing diabetes medication must be reviewed by qualified staff.', status: 'open' },
    { task: 'Provide baby formula', priority: 'high', team: 'Supplies', reason: 'Infant care supply needed.', status: 'open' },
    { task: 'Assign sleeping area for 5', priority: 'high', team: 'Shelter Lead', reason: 'Household needs safe sleeping placement.', status: 'open' },
    { task: 'Provide Arabic shelter instructions', priority: 'high', team: 'Translation', reason: 'Arabic language support requested.', status: 'open' },
    { task: 'Record lost ID issue', priority: 'medium', team: 'Admin', reason: 'Documentation support may be needed later.', status: 'open' },
  ],
  supply_request: [
    { item_name: 'Baby formula', category: 'Infant Care', quantity: 1, priority: 'high', public_shareable: true, reason: 'Infant in household needs formula.' },
    { item_name: 'Blankets', category: 'Shelter', quantity: 5, priority: 'high', public_shareable: true, reason: 'One blanket per household member.' },
    { item_name: 'Sleeping mats', category: 'Shelter', quantity: 5, priority: 'high', public_shareable: true, reason: 'Sleeping placement for household of 5.' },
    { item_name: 'Hygiene kits', category: 'Hygiene', quantity: 5, priority: 'medium', public_shareable: true, reason: 'One hygiene kit per household member.' },
  ],
  handoff: 'CASE-014: Flood evacuation family of 5 in Gym A. Medical desk should review missing diabetes medication. Supplies: formula, 5 blankets, 5 mats, 5 hygiene kits. Arabic instructions needed. Not a diagnosis; human review required.',
  sms: 'Northside School Gym: please check in at the intake desk. Staff can help with sleeping area, baby supplies, Arabic instructions, and urgent medical review.',
  family_instructions_english: 'Please stay near Gym A and speak with intake staff for sleeping space, baby supplies, and medical desk review. For urgent symptoms, alert staff immediately.',
  translated_instructions: 'Arabic family instructions generated for shelter staff review before sharing.',
  safety_notes: ['This is not a medical diagnosis.', 'Missing medication should be escalated to qualified staff.', 'Public exports must aggregate needs and hide medical details.'],
  grounding_sources: ['escalation_policy.md', 'supplies_policy.md', 'privacy_policy.md', 'translation_templates.md'],
}

export const demoCase = {
  id: 'CASE-014',
  shelter_id: 'demo-shelter',
  status: 'open',
  priority: 'high',
  urgency_score: 72,
  disaster_type: 'Flood',
  zone: 'Gym A',
  household_size: 5,
  languages: ['Arabic'],
  vulnerable_people: ['Infant', 'elderly', 'chronic illness'],
  immediate_needs: ['Baby formula', 'Sleeping area', 'Medication review', 'Arabic support'],
  notes_private: demoIntake.notes,
  summary: demoAnalysis.summary,
  updated_at: '10 mins ago',
  ...demoAnalysis,
}

export const cases = [
  { ...demoCase },
  { ...demoCase, id: 'CASE-013', priority: 'critical', urgency_score: 86, zone: 'Clinic Hall', household_size: 1, languages: ['English'], summary: 'Medical assessment required', immediate_needs: ['Medical assessment required'] },
  { ...demoCase, id: 'CASE-012', priority: 'medium', urgency_score: 28, zone: 'Gym B', household_size: 3, languages: ['Spanish'], summary: 'Blankets and sleeping mats', immediate_needs: ['Blankets'] },
]

export const inventory = [
  { id: 'inv-formula', item_name: 'Baby formula', category: 'Infant Care', in_stock: 2, needed: 10, gap: 8, priority: 'critical', public_shareable: true },
  { id: 'inv-blankets', item_name: 'Blankets', category: 'Shelter', in_stock: 20, needed: 45, gap: 25, priority: 'high', public_shareable: true },
  { id: 'inv-mats', item_name: 'Sleeping mats', category: 'Shelter', in_stock: 12, needed: 30, gap: 18, priority: 'high', public_shareable: true },
  { id: 'inv-arabic', item_name: 'Arabic-speaking volunteers', category: 'Language', in_stock: 0, needed: 3, gap: 3, priority: 'high', public_shareable: true },
  { id: 'inv-hygiene', item_name: 'Hygiene kits', category: 'Hygiene', in_stock: 10, needed: 30, gap: 20, priority: 'medium', public_shareable: true },
  { id: 'inv-medical', item_name: 'Medical desk reviews', category: 'Medical', in_stock: 1, needed: 4, gap: 3, priority: 'critical', public_shareable: false },
]

export const publicNeeds = inventory
  .filter((item) => item.public_shareable)
  .map((item) => ({ priority: item.priority, need: item.item_name, category: item.category, quantity: item.gap, how: item.category === 'Language' ? 'Sign up shift' : 'Drop-off accepted' }))
