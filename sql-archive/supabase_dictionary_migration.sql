-- Sözlük terimleri tablosunu oluşturun
CREATE TABLE IF NOT EXISTS public.dictionary_terms (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    term TEXT NOT NULL UNIQUE,
    definition TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- RLS'i etkinleştirin
ALTER TABLE public.dictionary_terms ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (SELECT)
CREATE POLICY "Sözlük terimleri herkese açık"
    ON public.dictionary_terms
    FOR SELECT
    USING (true);

-- Sadece admin ekleyebilir (INSERT)
CREATE POLICY "Sadece adminler sözlük terimi ekleyebilir"
    ON public.dictionary_terms
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Sadece admin güncelleyebilir (UPDATE)
CREATE POLICY "Sadece adminler sözlük terimi güncelleyebilir"
    ON public.dictionary_terms
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Sadece admin silebilir (DELETE)
CREATE POLICY "Sadece adminler sözlük terimi silebilir"
    ON public.dictionary_terms
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
