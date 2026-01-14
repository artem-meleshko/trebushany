-- Create a storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Policy to allow anyone to view images
create policy "Images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Policy to allow authenticated users (admins) to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- Policy to allow authenticated users to update/delete their images
create policy "Authenticated users can update images"
  on storage.objects for update
  using ( bucket_id = 'images' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete images"
  on storage.objects for delete
  using ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- Ensure pages table has correct structure for complex content (already JSONB, so flexible)
-- Adding a column for SEO metadata if not exists
alter table pages 
add column if not exists meta_title text,
add column if not exists meta_description text;
