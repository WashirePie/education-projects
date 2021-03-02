declare global 
{
  interface Window { 
    ipcRenderer: IpcRenderer;
    dialog: Dialog;
    path: string;
  }
}

import { IpcRenderer, ipcRenderer, Dialog, remote } from 'electron'

window.dialog = remote.dialog
window.ipcRenderer = ipcRenderer
window.path = remote.app.getAppPath()
