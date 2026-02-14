/**
 * Breadcrumb JSON-LD utility for all pages.
 * Generates BreadcrumbList structured data for Google SERP breadcrumbs.
 */

export interface BreadcrumbItem {
    name: string;
    href: string;
}

const BASE_URL = 'https://fizikhub.com';

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
    // Always start with homepage
    const allItems: BreadcrumbItem[] = [
        { name: 'Ana Sayfa', href: '/' },
        ...items,
    ];

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: allItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.href.startsWith('http') ? item.href : `${BASE_URL}${item.href}`,
        })),
    };
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
    const jsonLd = generateBreadcrumbJsonLd(items);
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
