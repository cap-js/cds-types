import { Query as CQN, expr, _xpr } from './cqn'
import { LinkedCSN } from './linked'
import { CSN } from './csn'

type _flavor = 'parsed' | 'xtended' | 'inferred'
type _odata_options = {
  flavor?: 'v2' | 'v4' | 'w4' | 'x4',
  version?: 'v2' | 'v4',
  structs?: boolean,
  refs?: boolean,
}
type _options = {
  flavor?: _flavor,
  plain?: boolean,
  docs?: boolean,
  names?: string,
  odata?: _odata_options,
} | _flavor

type JSON = string
type YAML = string
type CDL = string
type SQL = string
type XML = string
type EDM = { $version: string }
type EDMX = XML
type filename = string


/**
 * The effective CDS model loaded during bootstrapping, which contains all service and entity definitions,
 * including required services.
 * Should only be ever set explictly in test scenarios!
 */
export let model: LinkedCSN | undefined

/**
 * Provides a set of methods to parse a given model, query or expression.
 * You can also use `cds.parse()` as a shortcut to `cds.parse.cdl()`.
 */
export const parse: {

  /** Shortcut to `cds.parse.cdl()` */
  (cdl: CDL): CSN,
  cdl (cdl: CDL): CSN,
  cql (src: string): CQN,
  expr (src: string): expr,
  xpr (src: string): _xpr,
  ref (src: string): string[],
}

/**
 * Loads and parses models from the specified files.
 * Uses `cds.resolve` to fetch the respective models.
 * Essentially a shortcut for `cds.compile.to.csn(files)`
 * @param files - filenames of models or if folder containing models
 */
export function get (files: '*' | filename | filename[], o?: _options): Promise<CSN>

/**
 * Shortcut for `cds.get(files, 'inferred')`
 * @param files - filenames of models or if folder containing models
 */
export function load (files: '*' | filename | filename[], o?: _options): Promise<CSN>


/**
 * Resolves given file or module name(s) to an array of absolute file names.
 * Uses Node's `require.resolve` internally with the following additions:
 * - relative names are resolved relative to the current working directory instead of the current JavaScript module; hence, use __dirname if you want to find or load models relative to the current module.
 * - if no file extension is given, `.csn` and `.cds` will be appended in that order.
 * @param files - The file or module name(s) of a model or a folder containing models. Specify `'*'` to fetch moels from default locations, i.e. `[ 'db/', 'srv/', 'app/' ]`
 * @returns An array of absolute file names or `undefined` if none could be resolved.
 */
export function resolve (files: '*' | filename | filename[]): filename[] | undefined

/**
 * Turns the given plain CSN model into a linked model
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect)
 */
declare const linked: (model: CSN) => LinkedCSN

/**
 * Turns the given plain CSN model into a reflected model
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect)
 */
export const reflect: (model: CSN) => LinkedCSN

/**
* Provides a set of methods to parse a given model, query or expression.
* You can also use `cds.compile(csn).to('<output>')` as a fluent variant.
*/
export const compile: {

  /** Shortcut for `cds.compile.to.csn()` */
  cdl (model: CDL, o?: _options): CSN,

  for: {
    odata (model: CSN, o?: _options): CSN,
    sql (model: CSN, o?: _options): CSN,
  },
  to: {
    parsed: {
      csn (files: filename[], o?: _options): Promise<CSN>,
      csn (model: CDL, o?: _options): CSN,
    },
    xtended: {
      csn (files: filename[], o?: _options): Promise<CSN>,
      csn (model: CDL, o?: _options): CSN,
    },
    inferred: {
      csn (files: filename[], o?: _options): Promise<CSN>,
      csn (model: CDL, o?: _options): CSN,
    },
    csn (files: filename[], o?: _options): Promise<CSN>,
    csn (model: CDL, o?: _options): CSN,
    yml (model: CSN, o?: _options): YAML,
    yaml (model: CSN, o?: _options): YAML,
    json (model: CSN, o?: _options): JSON,
    sql (model: CSN, o?: _options): SQL[],
    cdl (model: CSN, o?: _options): CDL | Iterable<[CDL, { file: filename }]>,
    edm (model: CSN, o?: _options | _odata_options): EDM | string,
    edmx (model: CSN, o?: _options | _odata_options): EDMX | Iterable<[EDMX, { file: filename }]>,
    hdbcds (model: CSN, o?: _options): SQL | Iterable<[SQL, { file: filename }]>,
    hdbtable (model: CSN, o?: _options): SQL | Iterable<[SQL, { file: filename }]>,
  },

  /** Fluent API variant */
  (model: CSN | CDL): {
    for: {
      odata (o?: _options): CSN,
      sql (o?: _options): CSN,
    },
    to: {
      parsed: { csn (o?: _options): CSN },
      xtended: { csn (o?: _options): CSN },
      inferred: { csn (o?: _options): CSN },
      csn (o?: _options): CSN,
      yml (o?: _options): YAML,
      yaml (o?: _options): YAML,
      json (o?: _options): JSON,
      sql (o?: _options): SQL[],
      cdl (o?: _options): CDL | Iterable<[CDL, { file: filename }]>,
      edm (o?: _options | _odata_options): EDM | string,
      edmx (o?: _options | _odata_options): EDMX | Iterable<[EDMX, { file: filename }]>,
      hdbcds (o?: _options): SQL | Iterable<[SQL, { file: filename }]>,
      hdbtable (o?: _options): SQL | Iterable<[SQL, { file: filename }]>,
    },
  },

  /** Async fluent variant reading from files */
  (files: filename[]): {
    for: {
      odata (o?: _options): Promise<CSN>,
      sql (o?: _options): Promise<CSN>,
    },
    to: {
      parsed: { csn (o?: _options): Promise <CSN> },
      xtended: { csn (o?: _options): Promise <CSN> },
      inferred: { csn (o?: _options): Promise <CSN> },
      csn (o?: _options): Promise <CSN>,
      yml (o?: _options): Promise <YAML>,
      yaml (o?: _options): Promise <YAML>,
      json (o?: _options): Promise <JSON>,
      sql (o?: _options): Promise <SQL[]>,
      cdl (o?: _options): Promise <CDL | Iterable<[CDL, { file: filename }]>>,
      edm (o?: _options | _odata_options): Promise <EDM | string>,
      edmx (o?: _options | _odata_options): Promise <EDMX | Iterable<[EDMX, { file: filename }]>>,
      hdbcds (o?: _options): Promise <SQL | Iterable<[SQL, { file: filename }]>>,
      hdbtable (o?: _options): Promise <SQL | Iterable<[SQL, { file: filename }]>>,
    },
  },
}
