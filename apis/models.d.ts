import { Query as CQN, expr, _xpr } from './cqn'
import * as ln from './linked'
import * as LinkedClasses from './linked/classes'
import * as csn from './csn'

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
export let model: ln.CSN | undefined

/**
 * Provides a set of methods to parse a given model, query or expression.
 * You can also use `cds.parse()` as a shortcut to `cds.parse.cdl()`.
 */
export const parse: {

  /** Shortcut to `cds.parse.cdl()` */
  (cdl: CDL): csn.CSN,
  cdl (cdl: CDL): csn.CSN,
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
export function get (files: '*' | filename | filename[], o?: _options): Promise<csn.CSN>

/**
 * Shortcut for `cds.get(files, 'inferred')`
 * @param files - filenames of models or if folder containing models
 */
export function load (files: '*' | filename | filename[], o?: _options): Promise<csn.CSN>


/**
 * Resolves given file or module name(s) to an array of absolute file names.
 * Uses Node's `require.resolve` internally with the following additions:
 * - relative names are resolved relative to the current working directory instead of the current JavaScript module; hence, use __dirname if you want to find or load models relative to the current module.
 * - if no file extension is given, `.csn` and `.cds` will be appended in that order.
 * @param files - The file or module name(s) of a model or a folder containing models. Specify `'*'` to fetch moels from default locations, i.e. `[ 'db/', 'srv/', 'app/' ]`
 * @returns An array of absolute file names or `undefined` if none could be resolved.
 */
export function resolve (files: '*' | filename | filename[]): filename[] | undefined

export const linked: {

  /**
   * Turns the given plain CSN model into a linked model
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect)
   */
  (model: csn.CSN): ln.CSN,

  /**
   * Base classes of linked definitions from reflected models.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-builtin-classes)
   */
  classes: typeof LinkedClasses,
}

/**
 * Turns the given plain CSN model into a reflected model
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect)
 */
export function reflect (model: csn.CSN): ln.CSN

/**
* Provides a set of methods to parse a given model, query or expression.
* You can also use `cds.compile(csn).to('<output>')` as a fluent variant.
*/
export const compile: {

  /** Shortcut for `cds.compile.to.csn()` */
  cdl (model: CDL, o?: _options): csn.CSN,

  for: {
    odata (model: csn.CSN, o?: _options): csn.CSN,
    sql (model: csn.CSN, o?: _options): csn.CSN,
  },
  to: {
    parsed: {
      csn (files: filename[], o?: _options): Promise<csn.CSN>,
      csn (model: CDL, o?: _options): csn.CSN,
    },
    xtended: {
      csn (files: filename[], o?: _options): Promise<csn.CSN>,
      csn (model: CDL, o?: _options): csn.CSN,
    },
    inferred: {
      csn (files: filename[], o?: _options): Promise<csn.CSN>,
      csn (model: CDL, o?: _options): csn.CSN,
    },
    csn (files: filename[], o?: _options): Promise<csn.CSN>,
    csn (model: CDL, o?: _options): csn.CSN,
    yml (model: csn.CSN, o?: _options): YAML,
    yaml (model: csn.CSN, o?: _options): YAML,
    json (model: csn.CSN, o?: _options): JSON,
    sql (model: csn.CSN, o?: _options): SQL[],
    cdl (model: csn.CSN, o?: _options): CDL | Iterable<[CDL, { file: filename }]>,
    edm (model: csn.CSN, o?: _options | _odata_options): EDM | string,
    edmx (model: csn.CSN, o?: _options | _odata_options): EDMX | Iterable<[EDMX, { file: filename }]>,
    hdbcds (model: csn.CSN, o?: _options): SQL | Iterable<[SQL, { file: filename }]>,
    hdbtable (model: csn.CSN, o?: _options): SQL | Iterable<[SQL, { file: filename }]>,
  },

  /** Fluent API variant */
  (model: csn.CSN | CDL): {
    for: {
      odata (o?: _options): csn.CSN,
      sql (o?: _options): csn.CSN,
    },
    to: {
      parsed: { csn (o?: _options): csn.CSN },
      xtended: { csn (o?: _options): csn.CSN },
      inferred: { csn (o?: _options): csn.CSN },
      csn (o?: _options): csn.CSN,
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
      odata (o?: _options): Promise<csn.CSN>,
      sql (o?: _options): Promise<csn.CSN>,
    },
    to: {
      parsed: { csn (o?: _options): Promise <csn.CSN> },
      xtended: { csn (o?: _options): Promise <csn.CSN> },
      inferred: { csn (o?: _options): Promise <csn.CSN> },
      csn (o?: _options): Promise <csn.CSN>,
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
