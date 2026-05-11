insert into shelters (id, name, location, contact_name, contact_email, dropoff_instructions, public_board_enabled)
values (
  '00000000-0000-0000-0000-000000000014',
  'Northside School Gym',
  '1200 Maple Ave',
  'Maya Chen',
  'shelter-coordinator@example.org',
  'Main entrance, 8 AM - 8 PM',
  true
) on conflict (id) do nothing;

insert into inventory_items (shelter_id, item_name, category, in_stock, needed, unit, public_shareable)
values
('00000000-0000-0000-0000-000000000014', 'Baby formula', 'Infant Care', 2, 10, 'units', true),
('00000000-0000-0000-0000-000000000014', 'Blankets', 'Shelter', 20, 45, 'units', true),
('00000000-0000-0000-0000-000000000014', 'Sleeping mats', 'Shelter', 12, 30, 'units', true),
('00000000-0000-0000-0000-000000000014', 'Arabic-speaking volunteers', 'Language', 0, 3, 'shifts', true),
('00000000-0000-0000-0000-000000000014', 'Hygiene kits', 'Hygiene', 10, 30, 'units', true),
('00000000-0000-0000-0000-000000000014', 'Medical desk reviews', 'Medical', 1, 4, 'slots', false);
