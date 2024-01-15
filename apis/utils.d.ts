import * as fs from 'node:fs'

/**
 * Provides a set of utility functionss
 */
declare const utils: {

  /**
	 * Generates a new v4 UUID
	 * @see https://cap.cloud.sap/docs/node.js/cds-facade#cds-utils
	 */
  uuid (): string,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#decodeuri
	 */
  decodeURI(input: string): string,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#decodeuricomponent
	 */
  decodeURIComponent(input: string): string,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#local-filename
	 */
  local(filename: string): string,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#exists-file
	 */
  exist(file: string): boolean,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#isdir-file
	 */
  isdir(file: string): string,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#isdir-file
	 */
  isfile(file: string): string,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#async-read-file
	 */
  read(file: string): Promise<Buffer | object>,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#async-write-data-to-file
	 */
  write: {
    (data: object): {
      to(...file: string[]): Promise<ReturnType<typeof fs.promises.writeFile>>,
    },
    (file: string, data: object): Promise<ReturnType<typeof fs.promises.writeFile>>,
  },

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#async-copy-src-to-dst
	 */
  copy: {
    (src: string): {
      to(...dst: string[]): Promise<ReturnType<typeof fs.promises.copyFile>>,
    },
    (dst: string, src: string): Promise<ReturnType<typeof fs.promises.copyFile>>,
  },

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#async-mkdirp-path
	 */
  mkdirp: (...path: string[]) => Promise<string>,

  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#async-rmdir-path
	 */
  rmdir: (...path: string[]) => Promise<ReturnType<typeof fs.promises.rm>>,


  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#async-rimraf-path
	 */
  rimraf: (...path: string[]) => Promise<ReturnType<typeof fs.promises.rm>>,


  /**
	 * @see https://cap.cloud.sap/docs/node.js/cds-utils#async-rm-path
	 */
  rm: (...path: string[]) => Promise<ReturnType<typeof fs.promises.rm>>,
}
