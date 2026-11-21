import { assert, hostError, mockHost, mountWorker, test } from 'orca/testing'
import * as main from './worker'

const context = { workspaceId: 'workspace', branch: 'main', displayName: 'Main', terminals: [] }

test('launches only the fixed Gray command in the focused workspace and focuses its terminal', async () => {
  const host = mockHost({ results: {
    'workspace.readContext': context,
    'terminal.create': { terminalId: 'gray-terminal' },
    'terminal.focus': { focused: true }
  } })
  const worker = await mountWorker(main, { host })
  assert.deepEqual(await worker.request('gray.launch'), { focused: true })
  assert.deepEqual(host.callsOf('terminal.create'), [{ workspaceId: 'workspace', title: 'Gray', command: 'gray' }])
  assert.deepEqual(host.callsOf('terminal.focus'), [{ terminalId: 'gray-terminal' }])
  assert.deepEqual(worker.refusals, [])
  await worker.deactivate()
})

test('does not start a terminal without a focused workspace ID', async () => {
  for (const value of [null, { branch: '', displayName: 'Folder', terminals: [] }]) {
    const host = mockHost({ results: { 'workspace.readContext': value } })
    const worker = await mountWorker(main, { host })
    await assert.rejects(worker.request('gray.launch'), /Open a workspace/)
    assert.deepEqual(host.callsOf('terminal.create'), [])
    await worker.deactivate()
  }
})

test('reports a creation failure without trying to focus or retry', async () => {
  const host = mockHost({ results: {
    'workspace.readContext': context,
    'terminal.create': () => { throw hostError('action_failed', 'Workspace was removed') }
  } })
  const worker = await mountWorker(main, { host })
  await assert.rejects(worker.request('gray.launch'), /Workspace was removed/)
  assert.equal(host.callsOf('terminal.create').length, 1)
  assert.deepEqual(host.callsOf('terminal.focus'), [])
  await worker.deactivate()
})

test('keeps the created terminal when focus loses a race or fails', async () => {
  for (const focus of [{ focused: false }, () => { throw hostError('action_failed', 'No window') }]) {
    const host = mockHost({ results: {
      'workspace.readContext': context,
      'terminal.create': { terminalId: 'gray-terminal' },
      'terminal.focus': focus
    } })
    const worker = await mountWorker(main, { host })
    assert.deepEqual(await worker.request('gray.launch'), { focused: false })
    assert.equal(host.callsOf('terminal.create').length, 1)
    assert.deepEqual(host.callsOf('terminal.close'), [])
    await worker.deactivate()
  }
})
