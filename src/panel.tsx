import { atom, Button, Heading, plugin, read, set, Stack, Text } from 'orca'
import type {} from './protocol'

const busy = atom(false)
const status = atom('')

async function launch(): Promise<void> {
  if (read(busy)) return
  set(busy, true)
  set(status, '')
  try {
    const { focused } = await plugin.request('gray.launch')
    if (!focused) set(status, 'Orca started a Gray terminal in the background but could not focus it.')
  } catch (error) {
    set(status, error instanceof Error ? error.message : String(error))
  } finally {
    set(busy, false)
  }
}

export default function Panel() {
  return (
    <Stack gap="md">
      <Heading>Gray</Heading>
      <Text muted>Launch Gray in this workspace. Install gray on the workspace host and make sure its terminal can find it on PATH.</Text>
      <Button disabled={read(busy)} onPress={launch}>Launch Gray</Button>
      {read(status) && <Text>{read(status)}</Text>}
    </Stack>
  )
}
