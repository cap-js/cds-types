import cds from '../../../../apis/server'
import express from 'express'

const h = undefined as unknown as express.RequestHandler

cds.middlewares.add(h)
cds.middlewares.add(h, {at: 42})
cds.middlewares.add(h, {before: 'foo'})
cds.middlewares.add(h, {after: 'foo'})
cds.middlewares.add(h, {before: 'foo', after: 'foo'})
cds.middlewares.add(h, {after: 'foo', at: 2})