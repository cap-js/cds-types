import { csn, entity } from './cds'

type Texts = Record<string, string>

declare class I18nBundle {
  constructor(options: I18nFilesOptions)
  for(key: number | string | object, locale?: string | object, args?: object): string | undefined
  at(key: number | string | object, locale?: string | object, args?: object): string | undefined
  files: I18nFiles
  get defaults(): Record<string, string>
  get fallback(): Record<string, string>
  key4(definition: entity): string
  texts4 (locale: string): Texts
  translations4 (...locales : string[]) : { [locale: string]: Texts }
  translations4 (locale : 'all' ) : { [locale: string]: Texts }
  all () : Record<string, Texts>
}

declare interface I18nFacade {
  Bundle: typeof I18nBundle
  Facade: I18nFacade
  Files: typeof I18nFiles
  get file(): string
  get folders(): string[]
  get labels(): I18nBundle
  get messages(): I18nBundle

  bundle4 (file: string, options?: I18nFilesOptions): I18nBundle
  bundle4 (model: csn.CSN): I18nBundle
}

interface I18nFilesOptions {
  file?    : string   
  model?   : csn.CSN     
  roots?   : string[] 
  leafs?   : string[] 
  folders? : string[]
}

declare class I18nFiles {
  constructor (options: I18nFilesOptions)
  get options(): I18nFilesOptions
  get basename(): string
  content4(locale: string, suffix: string): Array<object>
}

export declare const i18n: I18nFacade