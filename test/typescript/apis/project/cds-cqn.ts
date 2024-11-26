import cds from '@sap/cds'
import { testType } from './dummy'

// we just access expected properties without doing anything with them to see if they are present
// as expected. To apease the linter, we assign them to a variable.
let res = undefined

// CQN
const sqn: cds.SELECT = {SELECT:{from:{ ref:[ 'Foo' ]}}}
// order by
sqn.SELECT.orderBy = [{ ref: ["bar"], sort: "desc" }]
sqn.SELECT.orderBy = [{ ref: ["bar"], sort: "asc" }]
sqn.SELECT.orderBy = [{ ref: ["bar"], nulls: "first" }]
sqn.SELECT.orderBy = [{ ref: ["bar"], nulls: "last" }]
sqn.SELECT.orderBy = [{ ref: ["bar"], sort: "desc", nulls: "last" }]

res = sqn.SELECT.distinct
res = sqn.SELECT.one
res = sqn.SELECT.from
res = sqn.SELECT.columns
res = sqn.SELECT.excluding
res = sqn.SELECT.where
res = sqn.SELECT.having
res = sqn.SELECT.groupBy
res = sqn.SELECT.orderBy
res = sqn.SELECT.limit
res = sqn.SELECT.mixin
res = sqn.SELECT.forShareLock?.wait
res = sqn.SELECT.forUpdate?.wait
res = sqn.SELECT.search?.at(0)
testType<boolean | undefined>(sqn.SELECT.count)

// Runtime only...
let q = SELECT.from('Foo')
res = q.SELECT.forUpdate
res = q.SELECT.forShareLock
res = q.SELECT.search
res = q.SELECT.count

const iqn: cds.INSERT = undefined as unknown as cds.INSERT
res = iqn.INSERT.into.hasOwnProperty('ref') || (typeof iqn.INSERT.into === 'string')
res = iqn.INSERT.columns
res = iqn.INSERT.values
res = iqn.INSERT.rows
res = iqn.INSERT.entries
res = iqn.INSERT.as.SELECT

const uqn: cds.UPDATE = undefined as unknown as cds.UPDATE
res = uqn.UPDATE.data['foo']
// res = uqn.UPDATE.entity.toLowerCase()  // lazy "type check" for string
res = uqn.UPDATE.where?.at(0)

const dqn: cds.DELETE = undefined as unknown as cds.DELETE
// res = dqn.DELETE.from.toLowerCase()  // lazy "type check" for string
res = dqn.DELETE.where?.at(0)

const crqn: cds.CREATE = undefined as unknown as cds.CREATE
res = crqn.CREATE.entity.hasOwnProperty('ref') || (typeof crqn.CREATE.entity === 'string')  // lazy "type check" for string
res = crqn.CREATE.as.SELECT

const drqn: cds.DROP = undefined as unknown as cds.DROP
res = drqn.DROP.entity.toLowerCase()  // lazy "type check" for string
res = drqn.DROP.table.ref
res = drqn.DROP.view.ref