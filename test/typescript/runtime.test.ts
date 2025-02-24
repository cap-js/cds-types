// FIXME: default export broke after 0.6.3 in CI, but works locally, renable asap
import * as cds from '@sap/cds';
import { User, Query } from '@sap/cds';
//import cds, { User, Query } from '@sap/cds';
import {
  Service,
  EventContext,
  Request,
  Event,
  // User, >> already imported above

  ApplicationService,
  MessagingService,
  DatabaseService,
  RemoteService,

  Association,
  Composition,
  // entity,
  event,
  // type,
  array,
  // struct,
  service,

} from '@sap/cds';
import { test, describe } from 'node:test';

describe('runtime tests', () => {

  let {Test} = cds.test
  let testInstance = new Test
  let log = testInstance.log()

  test('should test cds.test functionality', () => {
    expect(testInstance.test).toBe(testInstance)
    expect(typeof testInstance.run).toBe('function')
    expect(typeof testInstance.in).toBe('function')
    expect(typeof testInstance.log).toBe('function')
    expect(typeof testInstance.data.reset).toBe('function')
    console.log('foo')
    expect(log.output).toBe('foo\n') // only works in jest/mocha (which trigger beforeAll)
    console.log('bar')
    expect(log.output).toBe('foo\nbar\n')
    log.release()
    console.log('car')
    expect(log.output).toBe('')
  })

  test('should test miscellaneous functionality', () => {

    if (global.false) {
      let q1 : Query
      let x1 = q1.INSERT.entries[1].foo

      let csn = cds.parse(`entity Foo {}`)
      let Foo = csn.definitions.Foo
      Foo.query

      let e = new cds.entity

      let x = csn.definitions.Foo
      x instanceof cds.entity
      if (x.kind === 'entity') {
        x.query
        let z = x['@foo']
      }

      let {bar} = Foo.elements

      let m = cds.linked(csn)
      let Foo2 = m.entities.Foo
      Foo2.name
      Foo2.keys
      // commented out it types for now
      // Foo2.is('entity')
    }

    // FIXME: broke after 0.6.3 in CI, but works locally, renable asap
    //cds.model = cds.linked({})
    let foo = cds.extend({foo:1}).with({bar:2},{car:3})
    foo.foo
    foo.bar

    // FIXME: broke after 0.6.3 in CI, but works locally, renable asap
    //cds.model = cds.linked({})
    {
      let {
        requires,
        // plugins,
        version,
        env,
        home,
        // cli,
        root,

        // compiler,
        compile,
        resolve,
        load,
        get,
        parse ,
        // minify,
        extend,
        // deploy,
        // localize,
        // build,

        reflect,
        linked,
        // infer,
        builtin,
        Association,
        Composition,
        entity,
        event,
        type,
        array,
        struct,
        service,
        // impl: (/** @type {(this:Service, srv:Service, ...etc) => any} */ srv) => srv,
        // protocols: lazy => require('./srv/protocols'),
        // bindings: lazy => require('./srv/bindings'),
        // factory: lazy => require('./srv/factory'),
        // /** @type Service[] */ providers: []

        services,

        server,
        serve,
        connect,
        // middlewares,
        // odata,
        // auth,

        // emit,

        Service,
        EventContext,
        Request,
        Event,
        User,

        // Services, Protocols and Periphery
        ApplicationService,
        MessagingService,
        DatabaseService,
        RemoteService,

        // Contexts and Transactions
        context,
        spawn,
        tx,

        // Helpers
        utils,
        // error,
        // exec,
        test,
        log,
        debug,
        // clone,
        exit,

        ql,
        entities,

        run,
        foreach,
        stream,
        read,
        create,
        insert,
        update,
        delete : _delete,
        // disconnect,
        transaction,

      } = cds
    }

    cds.service.impl(srv => {
      srv.on('READ', 'Books', () => [{ID:1}])
    })

    cds.env.requires.db = { kind: 'sqlite' }
    // let { Books } = cds.entities

    expect (Service && cds.Service).toBe(Service)
    expect (Request && cds.Request).toBe(Request)
    expect (Event && cds.Event).toBe(Event)
    expect (User && cds.User).toBe(User)
    expect (cds.linked)

    class MyService extends cds.ApplicationService {}
    console.log (cds.linked(cds.parse(`entity Foo {}`)))
    console.log (cds.linked.toString())

    SELECT.from('Books').where({ID:1})

    let ua = new User('foo')
    expect (ua.id).toBe('foo')
    expect(ua.is('any'))
    expect(!ua.is('authenticated-user'))

    let u2 = new cds.User('me')
    expect (u2.id).toBe('me')
    expect(u2.is('any'))
    expect(u2.is('authenticated-user'))

    let r = new Request ({event:'foo',data:{foo:'bar'},headers:{x:11}})
    expect(r.event).toBe('foo')
    expect(r.data.foo).toBe('bar')
    expect(r.headers.x).toBe(11)

    expect (cds.Association)
    expect (cds.Composition)

    // .drafts is not available in lean draft mode in cds 8
    let Books = new cds.entity({name:'Books', elements: { HasDraftEntity:true }})
    // expect(Books.name).toBe('Books')
    // expect(Books.drafts.name).toBe('Books_drafts')
    // DELETE.from(Books.drafts || Books).where({ID:1})
    // UPDATE(Books.drafts || Books).with({}).where({ID:1})
    // INSERT.into(Books.drafts || Books).entries({})

    // FIXME: broke during 0.3.0-beta.1 in CI, but works locally -- re-enable asap
    // let q = SELECT.from(Books).where({ID:1})
    // expect(q.SELECT.from.ref[0]).toBe('Books')

    if (global.false) {
      let srv = new cds.Service
      let { Books } = srv.entities
      Books.name
      // FIXME: broke during 0.3.0-beta.1 in CI, but works locally -- re-enable asap
      // SELECT.from(Books.drafts || Books).where({ID:1})
      srv.before('READ', Books, console.log)
      srv.after('READ', Books, console.log)
      srv.on('READ', Books, console.log)
      srv.before('READ', Books.drafts, console.log)
      srv.after('READ', Books.drafts, console.log)
      srv.on('READ', Books.drafts, console.log)
      srv.before('READ', [ Books, Books.drafts ], console.log)
      srv.after('READ', [ Books, Books.drafts ], console.log)
      srv.on('READ', [ Books, Books.drafts ], console.log)
    }
    if (global.false) {
      let csn = cds.compile(`entity Foo { key ID: Integer; name: String; }`).to.csn()
      let { Foo } = csn.definitions
      // Foo.name //> error: .name is not defined on unlinked CSN definitions
      let m = cds.linked(csn)
      let { Bar } = m.entities
      Bar.name //> ok: .name is defined on linked definitions
      // FIXME: broke during 0.3.0-beta.1 in CI, but works locally -- re-enable asap
      // SELECT.from(Bar.drafts || Bar).where({ID:1})
    }

    cds.service.impl(srv => { srv.on('READ', Books, console.log) })
    cds.service.impl(function(){ this.on('READ', Books, console.log) })
    cds.service.impl(async function(){ this.on('READ', Books, console.log) })
    cds.service.impl(async srv => { srv.on('READ', Books, console.log) })

    // if (req instanceof cds.Association) console.log()

    let model = cds.parse.cdl(`entity Foo { key ID: Integer; name: String; }`)
    cds.linked(model)

  })

})
