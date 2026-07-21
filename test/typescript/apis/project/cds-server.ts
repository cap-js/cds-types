import cds from '@sap/cds'
import express, { Application } from 'express'

const h = undefined as unknown as express.RequestHandler

cds.middlewares.add(h)
cds.middlewares.add(h, {at: 42})
cds.middlewares.add(h, {before: 'foo'})
cds.middlewares.add(h, {after: 'foo'})
// @ts-expect-error only one of before, after, at can be used
cds.middlewares.add(h, {before: 'foo', after: 'foo'})
// @ts-expect-error
cds.middlewares.add(h, {after: 'foo', at: 2})

cds.middlewares.before

cds.error(404, 'Not Found')
cds.error('Not Found', {status: 404, stack: 'foo'})
cds.error `Message with formatted: ${{foo: 'bar'}}`
cds.error({status: 409, message: 'ERROR_MESSAGE'})

cds.app satisfies Application
