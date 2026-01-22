# Task: Enhance Rapid Science Feature

- [ ] **Database Setup**
    - [ ] Create `stories` table in Supabase (id, author_id, title, summary, image_url, color, created_at).
    - [ ] Add RLS policies: Public read, Writers create/delete.

- [ ] **Components: Viewer & Cards**
    - [ ] Create `StoryViewer` modal (Instagram story style, full screen, progress bar, close button).
    - [ ] Refactor `ScienceStories` to use the new compact neo-brutalist design.
    - [ ] Ensure `ScienceStories` fetches data from real `stories` table (or mock for now if DB access is strict, but I'll try to add SQL).

- [ ] **Components: Editor Flow**
    - [ ] Create `RapidScienceGuide` (Modal showing tips: "Keep it short", "Visuals first").
    - [ ] Create `RapidScienceEditor` (Simple form: Title, Image, Short Description, Background Color picker?).

- [ ] **Integration**
    - [ ] Add "Hızlı Bilim" button below the "Yazar" button in the designated area (likely Sidebar or ShareInput).
    - [ ] Update `UnifiedFeed` to inject `ScienceStories` after the 7th item.

- [ ] **Verification**
    - [ ] Test interactions (open/close story, submit story).
    - [ ] Verify mobile responsiveness.
