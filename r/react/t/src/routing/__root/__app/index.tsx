import { Paper } from '@mantine/core'
import { Prism } from '@mantine/prism'

export default function AppIndexRouting() {
  return (
    <Paper p = 'md'>
      <Prism language = 'markdown'>
        Hello, world!
      </Prism>
    </Paper>
  )
}
