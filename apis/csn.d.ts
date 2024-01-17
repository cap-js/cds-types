import { SELECT, ref, predicate } from './cqn'

/**
 * A parsed CDS model in CSN object notation.
 */
export interface CSN {

  /**
   * The assigned namespace. If parsed from multiple sources,
   * this is the topmost model's namespace, if any, not the
   * ones of imported models.
   */
  namespace?: string

  /**
   * The list of usings in this parsed model. Not available after
   * imports have been resolved into a merged model.
   */
  requires?: string[]

  /**
   * All definitions in the model including those from imported models.
   */
  definitions?: Record<FQN, Definition>

  /**
   * All extensions in the model including those from imported models.
   * Not available after extensions have been applied.
   */
  extensions?: Extension[]

  /**
   * The names of the files from which this model has been loaded.
   */
  $sources?: string[]
}

/**
 * The fully-quality name of a definition.
 */
export type FQN = string

/**
 * Definitions are the central elements of a CDS model.
 */
export type Definition = context & service & type & struct & entity & Association
// NOTE: If we use & instead of | CSN.definitions values would be reduced to <never>

/**
 * Extensions capture `extend Foo with { ... }` directives.
 */
export type Extension = {
  extend: FQN,
  elements?: { [name: string]: Element },
  includes?: FQN[],
}

export type Element = type & struct & Association

export type kinds = 'type' | 'entity' | 'event' | 'service' | 'context' | 'struct'

export interface any_ {
  kind?: kinds
}
export interface context extends any_ { }
export interface service extends any_ { }

export interface type extends any_ {
  type?: FQN
  items?: type
}

export interface struct extends type {

  /**
   * References to definitions to be included.
   * Not available after extensions have been applied.
  */
  includes?: FQN[]
  elements: { [name: string]: Element }
}

export interface entity extends Omit<struct, 'elements'> {

  /**
   * Entities with a query signify a view
   */
  query?: SELECT

  /**
   * Elements of entities may have additional qualifiers
   */
  elements: EntityElements
  // REVISIT: following should move to LinkedCSN
  keys: { [name: string]: Definition }
  drafts?: entity
}

export type EntityElements = {
  [name: string]: Element & {
    key?: boolean,
    virtual?: boolean,
    unique?: boolean,
    notNull?: boolean,
  },
}

export interface Association extends type {
  type: 'cds.Association' | 'cds.Composition'
  target: FQN

  /**
   * The specified cardinality. to-one = `{max:1}`, to-many = `{max:'*'}`
   */
  cardinality?: { src?: 1, min?: 1 | 0, max?: 1 | '*' }

  /**
   * The parsed on condition in case of unmanaged Associations
   */
  on?: predicate

  /**
   * The optionally specified keys in case of managed Associations
   */
  keys?: (ref & { as: string })[]
}
