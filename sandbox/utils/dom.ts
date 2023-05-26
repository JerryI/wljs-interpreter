export function getElement(targetElement: string): HTMLElement {
  const element = document.querySelector(targetElement)

  if (!element) {
    throw new Error(`Element '${targetElement}' doesn't exist.`)
  }

  return element as HTMLElement
}

export function showIframe(): void {
  elements.iframe.style.display = 'block'
  elements.errors.style.display = 'none'
}

export function showError(): void {
  elements.iframe.style.display = 'none'
  elements.errors.style.display = 'block'
}

export const elements = {
  iframe: getElement('[data-iframe]') as HTMLIFrameElement,
  errors: getElement('[data-errors]') as HTMLDivElement,
  editor: getElement('[data-editor]') as HTMLDivElement,
  jseditor: getElement('[data-editor-js]') as HTMLDivElement,
  source: getElement('[data-source]') as HTMLDivElement,
  loading: getElement('[data-loading]') as HTMLDivElement,
  code: getElement('[data-code]') as HTMLDivElement,
  fullbutton: getElement('[data-fullbutton]') as HTMLDivElement,
  logbutton: getElement('[data-logbutton]') as HTMLDivElement,
  sourceholder: getElement('[data-source-holder]') as HTMLDivElement,
  output:  getElement('[data-output]') as HTMLDivElement,

  buttonSave:  getElement('[data-save]') as HTMLDivElement,
  buttonImport:  getElement('[data-import]') as HTMLDivElement,
  buttonExport:  getElement('[data-export]') as HTMLDivElement,
  buttonIncludes:  getElement('[data-includes]') as HTMLDivElement,  
  buttonOpen:  getElement('[data-open]') as HTMLDivElement,

  modal: getElement('[data-modal]') as HTMLDivElement
}
