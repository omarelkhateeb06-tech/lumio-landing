-- User progress tracking for Lumio lessons
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id integer not null check (lesson_id between 1 and 30),
  completed_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  unique(user_id, lesson_id)
);

alter table public.user_progress enable row level security;

create policy "Users can read their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);
