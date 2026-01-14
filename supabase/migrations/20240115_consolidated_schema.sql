-- 1. Create Tables
create table if not exists pages (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  content jsonb default '[]'::jsonb,
  meta_title text,
  meta_description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric,
  image_url text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  message text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table pages enable row level security;
alter table products enable row level security;
alter table leads enable row level security;

-- 3. Create RLS Policies
-- Pages: Public read, Admin write
create policy "Public pages are viewable by everyone" 
  on pages for select using (true);

create policy "Admins can insert pages" 
  on pages for insert with check (auth.role() = 'authenticated');

create policy "Admins can update pages" 
  on pages for update using (auth.role() = 'authenticated');

-- Products: Public read, Admin write
create policy "Public products are viewable by everyone" 
  on products for select using (true);

create policy "Admins can insert products" 
  on products for insert with check (auth.role() = 'authenticated');

create policy "Admins can update products" 
  on products for update using (auth.role() = 'authenticated');

-- 4. Storage Setup
-- Create a storage bucket for images (idempotent insert)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Storage Policies (Drop existing to avoid conflicts if re-running)
drop policy if exists "Images are publicly accessible" on storage.objects;
drop policy if exists "Authenticated users can upload images" on storage.objects;
drop policy if exists "Authenticated users can update images" on storage.objects;
drop policy if exists "Authenticated users can delete images" on storage.objects;

create policy "Images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'images' );

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Authenticated users can update images"
  on storage.objects for update
  using ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete images"
  on storage.objects for delete
  using ( bucket_id = 'images' and auth.role() = 'authenticated' );

