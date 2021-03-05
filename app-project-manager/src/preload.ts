declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
    dialog: Dialog;
    path: string;
  }
}

import { IpcRenderer, ipcRenderer, Dialog, remote } from 'electron'
import "reflect-metadata"

window.dialog = remote.dialog
window.ipcRenderer = ipcRenderer
window.path = process.env.PWD!
