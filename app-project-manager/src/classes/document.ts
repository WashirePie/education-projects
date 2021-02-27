import { OpenDialogReturnValue } from "electron/main"
const path = require('path')

export class DocumentRef {
  name: string
  path: string
  ext: string

  constructor(_name: string, _path: string, _ext: string) {
    this.name = _name
    this.path = _path
    this.ext = _ext
  }

  static async promptSelection(): Promise<Array<DocumentRef>> {
    /* @ts-ignore */
    const res: OpenDialogReturnValue = await window.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Documents', extensions: ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'rtf', 'md', 'txt'] },
        { name: 'Media', extensions: ['jpg', 'png', 'gif', 'mkv', 'mp4', 'avi', 'tif', 'tiff', 'svg'] },
        { name: 'Code', extensions: ['js', 'ts', 'html', 'css', 'vue', 'cpp', 'c', 'h', 'hpp', 'cs', 'xml', 'json'] }
      ]
    })

    if (res.canceled || !res.filePaths.length) return []

    return res.filePaths.map(fp => {
      const name: string = path.basename(fp).split('.').shift()
      const ext: string = path.extname(fp)

      return new DocumentRef(name, fp, ext)
    })
  }
}