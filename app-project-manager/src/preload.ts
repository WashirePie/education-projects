declare global 
{
  interface Window { 
    ipcRenderer: IpcRenderer;
    dialog: Dialog;
  }
}

import { IpcRenderer, ipcRenderer, Dialog, remote } from 'electron'

window.dialog = remote.dialog
window.ipcRenderer = ipcRenderer