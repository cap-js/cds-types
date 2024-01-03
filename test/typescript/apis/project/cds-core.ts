import cds from '../../../../apis/cds'

const x = cds.extend({ a: 42 }).with({ b: 'hello world' })
const a: number = x.a
const b: string = x.b

const l1 = cds.lazify({x: 42})
l1.x

const l2 = cds.lazified({x: 42})
l2.x