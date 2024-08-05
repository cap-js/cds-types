// indirection for cds.d.ts, as we need the exact
// same exports in both named form and as default export
//                     import cds, { User } from '@sap/cds'
//  export * as default ...    ^      ^
//                                    ^ export * from ...
export * from './facade'
export * as default from './facade'
