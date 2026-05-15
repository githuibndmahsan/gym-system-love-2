
-- Public bucket for profile images (members, trainers, CEO)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read
create policy "Public can view profile images"
on storage.objects for select
using (bucket_id = 'profile-images');

-- Authenticated users (admins logged in) can manage
create policy "Authenticated can upload profile images"
on storage.objects for insert to authenticated
with check (bucket_id = 'profile-images');

create policy "Authenticated can update profile images"
on storage.objects for update to authenticated
using (bucket_id = 'profile-images');

create policy "Authenticated can delete profile images"
on storage.objects for delete to authenticated
using (bucket_id = 'profile-images');
