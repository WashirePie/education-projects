import { App, ComponentPublicInstance, createApp } from 'vue'
import PrimerLoading from './PrimerLoading.vue'

interface IPrimerLoading
{
  loadingInstance: App;
  loadingElement: ComponentPublicInstance;
  start(): void;
  update(value: number): void;
  finish(): void;
}

interface IPrimerLoadingData
{
  start?: boolean;
  progress?: number;
  height?: number;
}

class PrimerLoadingbar implements IPrimerLoading
{
  loadingInstance = createApp(PrimerLoading)
  loadingElement: ComponentPublicInstance & IPrimerLoadingData

  constructor()
  {
    this.loadingElement = this.loadingInstance.mount('#loading-bar')
    
  }

  setLoadingbar(state: boolean, value: number, height: number = 4)
  {
    this.loadingElement.start = state
    this.loadingElement.progress = value
    this.loadingElement.height = height
  }

  start(): void { this.setLoadingbar(true, 90) }
  finish(): void { this.setLoadingbar(false, 100, 0) }
  update(value: number): void { this.setLoadingbar(false, value) }
}

// Expose singleton
const instance = new PrimerLoadingbar()
export default instance