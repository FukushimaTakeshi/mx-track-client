import { RefObject, useEffect } from 'react'

export const useClickOutside = (
  ref: RefObject<HTMLDivElement>,
  callback: (e: Event) => void
): void => {
  useEffect(() => {
    const handleClick = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Element)) {
        callback(e)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [ref, callback])
}
