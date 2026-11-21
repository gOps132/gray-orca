# Gray for Orca

A community plugin that opens the interactive [Gray CLI](https://github.com/vstaln/gray) in the current Orca workspace. It is a terminal launcher, not a native chat or agent-picker integration. It uses Gray's existing configuration and does not submit prompts or change permissions.

## Install

1. Use Orca 1.4.259 or newer. Install [Gray](https://github.com/vstaln/gray#install) on the workspace host and make sure `gray` works in that workspace's Orca terminal.
2. In Orca, find **Gray for Orca** under **Settings → Plugins**, or run `orca plugin install gOps132/gray-orca`. Review the requested permissions before approving. The plugin reads the active workspace, opens a terminal there, and asks Orca to focus it.
3. Open the **Gray** panel in the right sidebar and click **Launch Gray**. If the terminal reports that `gray` is not found, fix `PATH` in the workspace's shell before retrying.

## Develop

```sh
orca plugin validate .
orca plugin test .
orca plugin check .
```

To load a local checkout in Orca, run `orca plugin dev load .` and review its approval prompt. Development folders reload on edits.
