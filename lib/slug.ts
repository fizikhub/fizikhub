const TURKISH_CHAR_MAP: Record<string, string> = {
    ğ: "g",
    ü: "u",
    ş: "s",
    ı: "i",
    ö: "o",
    ç: "c",
    Ğ: "g",
    Ü: "u",
    Ş: "s",
    İ: "i",
    I: "i",
    Ö: "o",
    Ç: "c",
};

export function slugify(input: string): string {
    return input
        .split("")
        .map((char) => TURKISH_CHAR_MAP[char] ?? char)
        .join("")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
