/**
 * Access to the configuration for Node.js runtime and tools.
 * The object is the effective result of configuration merged from various sources,
 * filtered through the currently active profiles, thus highly dependent on the current working
 * directory and process environment.
 */
export const env : {
    build: unknown,
    hana: unknown,
    i18n: unknown,
    mtx: unknown,
    requires: unknown,
    folders: unknown,
    odata: unknown,
    query: unknown,
    sql: unknown
} & { [key: string]: unknown }  // to allow additional values we have not yet captured

export const requires: unknown
export const version: string
export const home: string
export const root: string
