import { RefObject, useEffect } from 'react'

export const useClickInside = (
  ref: RefObject<HTMLDivElement>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClick = (e: Event) => {
      if (ref.current && ref.current.contains(e.target as Element)) {
        callback()
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [ref, callback])
}
