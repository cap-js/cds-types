import cds from '../../../..'

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

test.cds === cds // same type

const {server, url} = await test
