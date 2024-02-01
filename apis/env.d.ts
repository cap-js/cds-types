/**
 * Access to the configuration for Node.js runtime and tools.
 * The object is the effective result of configuration merged from various sources,
 * filtered through the currently active profiles, thus highly dependent on the current working
 * directory and process environment.
 */
export const env: {
  build: any,
  hana: any,
  i18n: any,
  mtx: any,
  requires: any,
  folders: any,
  odata: any,
  query: any,
  sql: any,
  features: {

   /**
    * @see [capire](https://cap.cloud.sap/docs/guides/databases#db-constraints)
    */
    assert_integrity: "off" | "app" | "db",

   /**
    * @see [capire](https://cap.cloud.sap/docs/node.js/cds-log#logging-in-production)
    */
    kibana_formatter: boolean,

   /**
    * @experimental
    * @see [capire](https://cap.cloud.sap/docs/advanced/odata#transformations)
    */
    odata_new_parser: boolean,

   /**
    * @see [capire](https://cap.cloud.sap/docs/releases/archive/2021/oct21#consuming-odata-v2-services-in-node-js)
    */
    cds_tx_inheritance: boolean,

   /**
    * @see [capire](https://cap.cloud.sap/docs/releases/archive/2022/jun22#optimized-search-on-sap-hana-as-default)
    */
    optimized_search: boolean,

   /**
    * @see [capire](https://cap.cloud.sap/docs/releases/archive/2022/jun22#new-rest-adapter-as-default)
    */
    rest_new_adapter: boolean,

   /**
    * @see [capire](https://cap.cloud.sap/docs/releases/jun23#new-protocol-specific-service-endpoints)
    */
    serve_on_root: boolean,

    with_mocks: boolean,

   /**
    * @private
    */
    hybrid_instance_manager: boolean,

   /**
    * @private
    */
    keys_in_data_compat: boolean,

   /**
    * @private
    */
    skip_unused: false | "all",

   /**
    * @private
    */
    with_parameters: boolean
  }
} & { [key: string]: any } // to allow additional values we have not yet captured

export const requires: any
export const version: string
export const home: string
export const root: string
