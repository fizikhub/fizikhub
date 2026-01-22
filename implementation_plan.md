# Implement Rapid Science (Hızlı Bilim) Stories

## Goal Description
Implement a "Rapid Science" (Hızlı Bilim) feature that allows writers to post short, visual science stories. These stories will be displayed in a compact, horizontally scrollable "snack content" area on the homepage (after the 7th item). The feature includes:
1.  **Database:** A new `stories` table.
2.  **UI:** Compact Neo-Brutalist cards that open an immersive, full-screen "Instagram Story" style viewer.
3.  **Editor:** A simplified creation flow for writers, accessible via a new button in the sidebar.

## User Review Required
> [!IMPORTANT]
> This requires a new database table `stories`. I will provide the SQL migration file. You might need to run it in your Supabase dashboard if I cannot execute it directly.

## Proposed Changes

### Database
#### [NEW] [stories_table.sql](file:///migrations/stories_table.sql)
- Create `stories` table: `id`, `author_id` (FK to profiles), `title`, `summary`, `image_url`, `color` (gradient), `created_at`.
- Enable RLS:
    - `SELECT` for everyone (public).
    - `INSERT/DELETE` for users where `is_writer = true`.

### Components
#### [NEW] [story-modal.tsx](file:///components/science-cards/story-modal.tsx)
- Full-screen overlay component using `framer-motion`.
- Shows image, title, summary, and author info.
- Progress bar at the top (auto-advance logic can be added later, for now just static or manual close).
- Close button (X) in the top right.

#### [MODIFY] [science-stories.tsx](file:///components/science-cards/science-stories.tsx)
- Connect to Supabase to fetch real data from `stories` table.
- Use `StoryModal` for displaying content.
- Update styling to be "Neo-Futuristic / Neo-Brutalist" as requested (compact, no "AI look").

#### [NEW] [rapid-science-editor-modal.tsx](file:///components/science-cards/rapid-science-editor-modal.tsx)
- Modal that opens when "Hızlı Bilim" button is clicked.
- **Step 1:** Guide ("Hızlı Bilim Nedir?").
- **Step 2:** Form (Title, Image Upload, Summary, Color Picker).
- Handles submission to `stories` table.

#### [MODIFY] [feed-sidebar.tsx](file:///components/home/feed-sidebar.tsx)
- Add "Hızlı Bilim" button below "İçerik Üretmeye Başla".
- Only visible to users with `is_writer`.

#### [MODIFY] [unified-feed.tsx](file:///components/home/unified-feed.tsx)
- Inject `ScienceStories` component after the 7th item (index 6, since 0-indexed).

## Verification Plan

### Manual Verification
1.  **Database:** Check if `stories` table exists (I'll try to insert a dummy row).
2.  **UI - Home:** reload homepage and scroll to 7th item. Verify `ScienceStories` strip appears.
3.  **UI - Interaction:** Click a story card. Verify it opens full screen (modal) and closes with X.
4.  **UI - Editor:**
    - Log in as a writer (I will temporarily grant writer role to my test user if needed, or simulate UI).
    - Click "Hızlı Bilim" in sidebar.
    - Check Guide -> Editor flow.
    - Submit a story.
    - Verify it appears in the feed.
