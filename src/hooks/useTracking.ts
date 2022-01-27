import { useEffect } from 'react'
import { useHistory } from 'react-router'

declare global {
  interface Window {
    gtag?: (
      key: string,
      trackingId: string,
      config: { page_path: string }
    ) => void
  }
}

export const useTracking = (
  trackingId: string | undefined = 'G-NZL8BZ6MLX' // process.env.REACT_APP_GA_ID
): void => {
  const { listen } = useHistory()
  useEffect(() => {
    const unListen = listen((location) => {
      if (!window.gtag) return
      if (!trackingId) return

      window.gtag('config', trackingId, { page_path: location.pathname })
    })

    return unListen
  }, [trackingId, listen])
}
