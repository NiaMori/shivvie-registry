import type { ComponentType, PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Notifications } from '@mantine/notifications'

import { ThemeProvider } from '@/misc/theme'

const components: ComponentType<PropsWithChildren>[] = [
  ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
  ({ children }) => <><Notifications />{children}</>,
  ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
]

export function Providers({ children }: PropsWithChildren) {
  return components.reduceRight((children, Comp) => (<Comp>{children}</Comp>), children)
}
