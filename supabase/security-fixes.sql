-- ==========================================
-- Supabase Security Fix Script
-- ==========================================
-- This script fixes "Function Search Path Mutable" warnings by explicitly
-- setting the search_path for all functions in the public schema to 'public'.
--
-- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR
-- ==========================================

DO $$
DECLARE
    func_record record;
BEGIN
    FOR func_record IN
        SELECT n.nspname as schema_name, p.proname as function_name, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prokind = 'f'
    LOOP
        EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp;',
            func_record.schema_name, func_record.function_name, func_record.args);
    END LOOP;
END $$;
