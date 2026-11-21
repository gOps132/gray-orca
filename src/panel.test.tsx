import { assert, hostError, mockHost, mount, test } from 'orca/testing'
import * as panel from './panel'

test('reports a failed launch, then clears the message on a successful retry', async () => {
  let launches = 0
  const host = mockHost({ requests: {
    'gray.launch': () => {
      if (++launches === 1) throw hostError('action_failed', 'Workspace was removed')
      return { focused: true }
    }
  } })
  const view = await mount(panel, { host })
  assert.equal(launches, 0)
  await view.press({ text: 'Launch Gray' })
  assert.ok(view.find({ text: 'Workspace was removed' }))
  await view.press({ text: 'Launch Gray' })
  assert.equal(launches, 2)
  assert.ok(!view.find({ text: 'Workspace was removed' }))
  assert.deepEqual(view.errors, [])
  await view.unmount()
})

test('reports a background terminal without asking the worker to launch again', async () => {
  let launches = 0
  const host = mockHost({ requests: { 'gray.launch': () => { launches++; return { focused: false } } } })
  const view = await mount(panel, { host })
  await view.press({ text: 'Launch Gray' })
  assert.ok(view.find({ text: 'Orca started a Gray terminal in the background but could not focus it.' }))
  assert.equal(launches, 1)
  assert.deepEqual(view.errors, [])
  await view.unmount()
})
