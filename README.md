# Gray for Orca

Open the [Gray CLI](https://github.com/vstaln/gray) in your current [Orca](https://github.com/stablyai/orca) workspace. The plugin adds a **Gray** panel to Orca’s right sidebar; **Launch Gray** opens and focuses an interactive terminal.

## Install the plugin

1. Use Orca **1.4.259 or newer** and [install Gray](https://github.com/vstaln/gray#install) on the machine running your workspace. Check that `gray --version` works in an Orca terminal there.
2. Look for **Gray for Orca** under **Settings → Plugins**, or install it from GitHub:

   ```sh
   orca plugin install gOps132/gray-orca
   ```

3. Review and approve the requested access. Open the **Gray** panel in the right sidebar and click **Launch Gray**.

The plugin reads the active workspace, starts the `gray` command, and asks Orca to focus the new terminal. It uses your existing Gray configuration and does not send a prompt or change Gray’s permissions. If the terminal can’t find `gray`, fix `PATH` on the workspace host before retrying.

## Gray in Orca’s New Workspace picker

The sidebar plugin **does not** add a harness to **⌘N → Select agent**. That requires a separate change to Orca itself. In an Orca build with that change, choose **Gray**, then optionally choose a model and provider before creating the workspace. Orca reads the catalog from `gray --dump-models cached` and applies your choice only to the new terminal session. The plugin is not needed for that flow. Neither integration adds Gray to Orca’s native Chat UI.

## Develop the plugin

```sh
orca plugin validate .
orca plugin test .
orca plugin check .
orca plugin dev load .
```

Review the approval request when loading your local checkout. Orca reloads development plugins when their files change.
