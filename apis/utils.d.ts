import type * as fs from 'node:fs'

/**
 * Provides a set of utility functions
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
  exists(file: string): boolean,

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

  /**
   * @since 8.3.0
   * @see https://cap.cloud.sap/docs/node.js/cds-utils#colors
   */
  colors: {
    enabled: boolean,
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m' | '',
    BRIGHT: '\x1b[1m' | '',
    DIMMED: '\x1b[2m' | '',
    ITALIC: '\x1b[3m' | '',
    UNDER: '\x1b[4m' | '',
    BLINK: '\x1b[5m' | '',
    FLASH: '\x1b[6m' | '',
    INVERT: '\x1b[7m' | '',
    BLACK: '\x1b[30m' | '',
    RED: '\x1b[31m' | '',
    GREEN: '\x1b[32m' | '',
    YELLOW: '\x1b[33m' | '',
    BLUE: '\x1b[34m' | '',
    PINK: '\x1b[35m' | '',
    CYAN: '\x1b[36m' | '',
    LIGHT_GRAY: '\x1b[37m' | '',
    DEFAULT: '\x1b[39m' | '',
    GRAY: '\x1b[90m' | '',
    LIGHT_RED: '\x1b[91m' | '',
    LIGHT_GREEN: '\x1b[92m' | '',
    LIGHT_YELLOW: '\x1b[93m' | '',
    LIGHT_BLUE: '\x1b[94m' | '',
    LIGHT_PINK: '\x1b[95m' | '',
    LIGHT_CYAN: '\x1b[96m' | '',
    WHITE: '\x1b[97m' | '',
    bg: {
      BLACK: '\x1b[40m' | '',
      RED: '\x1b[41m' | '',
      GREEN: '\x1b[42m' | '',
      YELLOW: '\x1b[43m' | '',
      BLUE: '\x1b[44m' | '',
      PINK: '\x1b[45m' | '',
      CYAN: '\x1b[46m' | '',
      WHITE: '\x1b[47m' | '',
      DEFAULT: '\x1b[49m' | '',
      LIGHT_GRAY: '\x1b[100m' | '',
      LIGHT_RED: '\x1b[101m' | '',
      LIGHT_GREEN: '\x1b[102m' | '',
      LIGHT_YELLOW: '\x1b[103m' | '',
      LIGHT_BLUE: '\x1b[104m' | '',
      LIGHT_PINK: '\x1b[105m' | '',
      LIGHT_CYAN: '\x1b[106m' | '',
      LIGHT_WHITE: '\x1b[107m' | '',
    },
  },
}
