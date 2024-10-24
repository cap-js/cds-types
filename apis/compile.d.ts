import { CSN } from './csn'

/**
 * Minifies a given CSN model by removing all unused1 types and aspects, as well all entities tagged with `@cds.persistence.skip:'if-unused'`
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-compile#cds-minify)
 */
export function minify (model: CSN): CSN