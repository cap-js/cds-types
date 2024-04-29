import cds from '../../../../apis/server'

cds.middlewares.add({})
cds.middlewares.add({}, {at: 42})
cds.middlewares.add({}, {before: 'foo'})
cds.middlewares.add({}, {after: 'foo'})
cds.middlewares.add({}, {before: 'foo', after: 'foo'})
cds.middlewares.add({}, {after: 'foo', at: 2})