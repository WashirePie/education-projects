import { OpenDialogReturnValue } from "electron/main"
import * as path from "path";

export class DocumentRef {
  constructor(name: string, docPath: string, ext: string) {
    this._name = name
    this._path = docPath
    this._ext = ext
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }

  private _path: string;
  public get path(): string {
    return this._path;
  }
  public set path(v: string) {
    this._path = v;
  }

  private _ext: string;
  public get ext(): string {
    return this._ext;
  }
  public set ext(v: string) {
    this._ext = v;
  }

  static async promptSelection(): Promise<Array<DocumentRef>> {
    /* @ts-ignore */
    const res: OpenDialogReturnValue = await window.dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Code', extensions: ['js', 'ts', 'html', 'css', 'vue', 'cpp', 'c', 'h', 'hpp', 'cs', 'xml', 'json'] },
        { name: 'Documents', extensions: ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'rtf', 'md', 'txt'] },
        { name: 'Media', extensions: ['jpg', 'png', 'gif', 'mkv', 'mp4', 'avi', 'tif', 'tiff', 'svg'] },
      ]
    })

    if (res.canceled || !res.filePaths.length) return []

    return res.filePaths.map(fp => {
      const name: string = path.basename(fp).split('.').shift()!
      const ext: string = path.extname(fp)

      return new DocumentRef(name, fp, ext)
    })
  }
}