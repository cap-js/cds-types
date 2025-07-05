import cds from '@sap/cds'
import { testType } from './dummy'

testType<any>(new cds.Request({ event: 'Foo' } ).subject)
testType<number>(new cds.Request<number>({ event: 'Foo' } ).subject)
