import type { MantineThemeOverride } from '@mantine/core'
import { MantineProvider } from '@mantine/core'

const themeOverride: MantineThemeOverride = {
  colorScheme: 'light',
}

export function ThemeProvider({ children }: {
  children: React.ReactNode
}) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme = {themeOverride}>
      {children}
    </MantineProvider>
  )
}
