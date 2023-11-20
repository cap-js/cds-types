export default class {
  /**
   * Access to the configuration for Node.js runtime and tools.
   * The object is the effective result of configuration merged from various sources,
   * filtered through the currently active profiles, thus highly dependent on the current working
   * directory and process environment.
   */
  env : {
    build: any,
    hana: any,
    i18n: any,
    mtx: any,
    requires: any,
    folders: any,
    odata: any,
    query: any,
    sql: any
  }

  requires: any
  version: string
  home: string
  root: string

}
