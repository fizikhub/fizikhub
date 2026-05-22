import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
    const [value, setValue] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches;
        }
        return false;
    })

    useEffect(() => {
        const result = window.matchMedia(query)
        
        // Prevent state update if it hasn't changed to avoid re-renders
        if (result.matches !== value) {
            setValue(result.matches)
        }

        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches)
        }

        result.addEventListener("change", onChange)

        return () => result.removeEventListener("change", onChange)
    }, [query, value])

    return value
}
