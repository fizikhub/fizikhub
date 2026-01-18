-- ==========================================
-- Supabase Security Fix Script (v2)
-- ==========================================
-- This script fixes "Function Search Path Mutable" warnings by explicitly
-- setting the search_path for all functions in the public schema to 'public'.
--
-- IMPROVEMENTS v2:
-- 1. Skips functions that belong to extensions (like pg_trgm's set_limit).
-- 2. Adds error handling to skip any other problematic functions without stopping.
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
        -- Join pg_depend to find extension dependencies
        LEFT JOIN pg_depend d ON d.objid = p.oid AND d.deptype = 'e'
        WHERE n.nspname = 'public'
        AND p.prokind = 'f'
        AND d.objid IS NULL -- Exclude functions that are part of an extension
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp;',
                func_record.schema_name, func_record.function_name, func_record.args);
            
            RAISE NOTICE 'Fixed: %.%', func_record.schema_name, func_record.function_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping %.%: %', func_record.schema_name, func_record.function_name, SQLERRM;
        END;
    END LOOP;
END $$;
