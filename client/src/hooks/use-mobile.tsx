import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT
}

/**
 * React hook that returns whether the viewport is below the mobile breakpoint
 * (768px), updating reactively as the window is resized.
 *
 * @returns `true` when the viewport width is in the mobile range.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(isMobileViewport())
    }
    mql.addEventListener("change", onChange)
    setIsMobile(isMobileViewport())
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
