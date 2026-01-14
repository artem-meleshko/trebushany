-- Create pages table
create table public.pages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text not null,
  title text not null,
  content_json jsonb default '{}'::jsonb,
  is_published boolean default false,
  lang text default 'ua' check (lang in ('ua', 'en')),
  unique(slug, lang)
);

-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price decimal(10,2),
  image_url text,
  category text,
  is_available boolean default true
);

-- Create leads table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  phone text,
  message text,
  status text default 'new'
);

-- Enable RLS (Row Level Security)
alter table public.pages enable row level security;
alter table public.products enable row level security;
alter table public.leads enable row level security;

-- Create policies (Simplified for now - Public Read, Anon Write for leads)
create policy "Public pages are viewable by everyone" on public.pages
  for select using (is_published = true);

create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Anyone can insert leads" on public.leads
  for insert with check (true);
