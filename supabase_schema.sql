-- ----------------------------------------------------
-- SUPABASE MIGRATION DATABASE SCHEMA & POLICIES
-- Pempek Palembang Cek Lis
-- Copy and run this script in Supabase SQL Editor
-- ----------------------------------------------------

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables if needed (WARNING: will delete data if run again)
-- drop table if exists public.users cascade;
-- drop table if exists public.products cascade;
-- drop table if exists public.banners cascade;
-- drop table if exists public.testimonials cascade;
-- drop table if exists public.gallery cascade;
-- drop table if exists public.settings cascade;

-- Table: users (Stores custom user roles mapped from Supabase Auth auth.users)
create table public.users (
  uid text primary key,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'developer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: products (Store items catalog)
create table public.products (
  id text primary key default uuid_generate_v4()::text,
  name text not null,
  slug text not null unique,
  description text not null,
  price integer not null,
  status text not null check (status in ('published', 'draft')),
  featured boolean not null default false,
  images text[] not null default '{}',
  seo_title text,
  seo_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: banners (Promo Sliders)
create table public.banners (
  id text primary key default uuid_generate_v4()::text,
  title text not null,
  desktop_image text not null,
  mobile_image text not null,
  button_text text,
  button_url text,
  active boolean not null default true,
  start_date text,
  end_date text,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: testimonials (Customer Feedbacks)
create table public.testimonials (
  id text primary key default uuid_generate_v4()::text,
  customer_name text not null,
  content text not null,
  published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: gallery (Store and product photos)
create table public.gallery (
  id text primary key default uuid_generate_v4()::text,
  image_url text not null,
  caption text not null,
  type text not null check (type in ('product', 'store')),
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: settings (Website operational preferences)
create table public.settings (
  id text primary key default 'website',
  site_name text not null,
  hero_title text not null,
  hero_subtitle text not null,
  phone text not null,
  whatsapp text not null,
  instagram text not null,
  address text not null,
  google_maps_url text,
  business_hours text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for all tables
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.banners enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery enable row level security;
alter table public.settings enable row level security;

-- Policies for public reading (Read is open for anyone)
create policy "Allow public read access to products" on public.products for select using (true);
create policy "Allow public read access to banners" on public.banners for select using (true);
create policy "Allow public read access to testimonials" on public.testimonials for select using (true);
create policy "Allow public read access to gallery" on public.gallery for select using (true);
create policy "Allow public read access to settings" on public.settings for select using (true);

-- Policy check helper functions (defined with SECURITY DEFINER to bypass RLS mapping checks)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where users.uid = auth.uid()::text
    and (users.role = 'admin' or users.role = 'developer')
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_developer()
returns boolean as $$
begin
  return exists (
    select 1 from public.users
    where users.uid = auth.uid()::text
    and users.role = 'developer'
  );
end;
$$ language plpgsql security definer;

-- Apply write policies (Insert, Update, Delete) to tables using helper functions
create policy "Allow admin write to products" on public.products for all using (is_admin());
create policy "Allow admin write to banners" on public.banners for all using (is_admin());
create policy "Allow admin write to testimonials" on public.testimonials for all using (is_admin());
create policy "Allow public insert to testimonials" on public.testimonials for insert with check (true);
create policy "Allow admin write to gallery" on public.gallery for all using (is_admin());
create policy "Allow admin write to settings" on public.settings for all using (is_admin());

create policy "Allow self or developer read to users" on public.users for select
  using (auth.uid()::text = uid or is_developer());
create policy "Allow developer write to users" on public.users for all using (is_developer());

-- Trigger to automatically mirror new auth users to public users table
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (uid, email, role)
  values (new.id, new.email, 'admin');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
