import cds from '../../../../apis/cds'

const x = cds.extend({ a: 42 }).with({ b: 'hello world' })
const a: number = x.a
const b: string = x.b

const l1 = cds.lazify({x: 42})
l1.x

const l2 = cds.lazified({x: 42})
l2.x

const entity: cds.entity = new cds.entity
entity.drafts
const event: cds.event = new cds.event
event.elements
const type: cds.type = new cds.type
type.name
const array: cds.array = new cds.array
array.name
const struct: cds.struct = new cds.struct
struct.elements