import type { OrcaWorkerApi } from 'orca/worker'
import type {} from './protocol'

export default function activate(orca: OrcaWorkerApi): void {
  orca.panels.handle('gray.launch', async () => {
    const workspace = await orca.host.call('workspace.readContext')
    if (!workspace?.workspaceId) throw new Error('Open a workspace in Orca before launching Gray.')

    const { terminalId } = await orca.host.call('terminal.create', {
      workspaceId: workspace.workspaceId,
      title: 'Gray',
      command: 'gray'
    })

    // The launch succeeded even if Orca cannot bring that terminal to the foreground.
    try {
      return await orca.host.call('terminal.focus', { terminalId })
    } catch {
      return { focused: false }
    }
  })
}
