import cds from '@sap/cds'

const test = cds.test(__dirname).in('other')
cds.test('serve', '--in-memory', '--project', __dirname)
cds.test('dir').run('cmd', '--arg1', '--arg2');
(new cds.test.Test).run(...['1','2','3'])


const {GET, DELETE, POST, PUT} = test
const {get, delete:del, post, put} = test
test.axios

test.chai
test.expect

test.data.autoReset(true)
await test.data.delete()
await test.data.reset()

// should be the exact same type, in the rollup scenario, they are not
// Probably due to having module augmentation wrapped around cds.d.ts
// So we just check for equality in some of the properties to get some confidence
test.cds.ql === cds.ql
test.cds.ApplicationService === cds.ApplicationService
test.cds.get === cds.get

cds.test.log().clear()
cds.test.log().output.charAt(1)
cds.test.log().release()

const {server, url} = await test

GET `/processor/$metadata`
GET ('/processor/$metadata')
GET ('/processor/$metadata', { auth: { username: 'alice', password: '' } })
