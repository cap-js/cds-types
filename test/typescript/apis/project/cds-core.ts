import cds from '@sap/cds'

const x = cds.extend({ a: 42 }).with({ b: 'hello world' })
const a: number = x.a
const b: string = x.b

const l1 = cds.lazify({x: 42})
l1.x

const l2 = cds.lazified({x: 42})
l2.x

const e: cds.entity = new cds.entity
e.drafts
cds.entity === cds.builtin.classes.entity

const ev: cds.event = new cds.event
ev.elements
cds.event === cds.builtin.classes.event

const t: cds.type = new cds.type
t.name
cds.type === cds.builtin.classes.type

const arr: cds.array = new cds.array
arr.name
cds.array === cds.builtin.classes.array

const s: cds.struct = new cds.struct
s.elements
cds.struct === cds.builtin.classes.struct
