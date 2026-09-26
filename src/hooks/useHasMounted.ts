'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/** True only after hydration – prevents localStorage-driven UI from mismatching the server render. */
export const useHasMounted = () => useSyncExternalStore(subscribe, () => true, () => false)
