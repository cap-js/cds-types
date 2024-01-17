import { entity } from './csn' // cyclic dependency
import { UnionToIntersection, UnionsToIntersections } from './internal/inference'

// FIXME: a union type would be more appropriate here
export type Query = Partial<SELECT & INSERT & UPDATE & DELETE & CREATE & DROP & UPSERT>

export type SELECT = { SELECT: {
  distinct?: true,
  one?: boolean,
  from: source,
  mixin?: { [key: string]: expr },
  columns?: column_expr[],
  excluding?: string[],
  where?: predicate,
  having?: predicate,
  groupBy?: expr[],
  orderBy?: ordering_term[],
  limit?: { rows: val, offset: val },
}, }

export type INSERT = { INSERT: {
  into: ref | name,
  entries: data[],
  columns: string[],
  values: scalar[],
  rows: scalar[][],
  as: SELECT,
}, }

export type UPSERT = { UPSERT: {
  into: ref | name,
  columns: string[],
  entries: data[],
  values: scalar[],
  rows: scalar[][],
}, }

export type UPDATE = { UPDATE: {
  entity: ref | name,
  data: { [key: string]: expr },
  where?: predicate,
}, }

export type DELETE = { DELETE: {
  from: ref | name,
  where?: predicate,
}, }

export type CREATE = { CREATE: {
  entity: entity | name,
  as: SELECT,
}, }

export type DROP = { DROP: {
  entity: name,
  table: ref,
  view: ref,
}, }

/** @private */
type scalar = number | string | boolean | null

/** @private */
type data = Record<string, any>

/** @private */
type name = string

/** @private */
type source = UnionToIntersection<ref | SELECT> & { as?: name, join?: name, on?: xpr }
export type column_expr = UnionToIntersection<expr> & { as?: name, cast?: any, expand?: column_expr[], inline?: column_expr[] }
export type predicate = UnionsToIntersections<_xpr>

/** @private */
type ordering_term = expr & { sort?: 'asc' | 'desc', nulls?: 'first' | 'last' }

export type expr = ref | val | xpr | function_call | SELECT

/** @private */
type ref = { ref: (name & { id?: string, where?: expr, args?: expr[] })[] }

/** @private */
type val = { val: any }

/** @private */
type xpr = { xpr: _xpr }

/** @private */
type _xpr = (expr | operator) []

/** @private */
type operator = string

/** @private */
type function_call = { func: string, args: { [key: string]: any }[] }

export type enum_literal = { '#': string }
export type expr_literal = { '=': string }
