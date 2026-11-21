import 'orca/host'

declare module 'orca/host' {
  interface PluginRequests {
    'gray.launch': { input: undefined; output: { focused: boolean } }
  }
}
