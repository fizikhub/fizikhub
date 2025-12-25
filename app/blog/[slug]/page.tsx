// Re-export the implementation from the makale page to ensure consistent behavior
// and fix the 404 error for /blog/[slug] links.

export { generateMetadata, revalidate } from "@/app/makale/[slug]/page";
export { default } from "@/app/makale/[slug]/page";
