import { Header, AppShell as MantineAppShell, useMantineTheme } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { MantineLogo } from '@mantine/ds'
import { css } from '@emotion/react'

export function AppShell() {
  const theme = useMantineTheme()

  return (
    <MantineAppShell
      header = {
        <Header height = '4rem' p = 'md'>
          <MantineLogo css = {css`height: 2rem;`} />
        </Header>
      }
      p = 'md'
      sx = {{
        backgroundColor: theme.colors.gray[0],
      }}
    >
      <Outlet />
    </MantineAppShell>
  )
}
