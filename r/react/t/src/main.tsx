import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Routing } from '@/routing'
import { Providers } from '@/misc/providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <Routing />
    </Providers>
  </StrictMode>,
)
