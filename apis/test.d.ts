import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import * as chai from 'chai'
import * as http from 'http'
import { Service } from './services'
import type * as cds from './cds'

type _cds = typeof cds

type TaggedTemplateRequest = (strings: TemplateStringsArray, ...params: unknown[]) => Promise<AxiosResponse>

declare class Axios {

  /**
   * @deprecated Used to provide access to an `axios` instance used as HTTP client. From `@cap-js/cds-test` >=1 onwards, it no longer points to
   * the real `axios` library, but to an emulated lookalike, mostly for backward compatibility.
   * Install `axios` explicitly as a project dependency if you need the full feature set of it. In that case, the HTTP shortcuts will automatically
   * use the installed `axios` instead of the emulated version.
   */
  get axios (): AxiosInstance

  /**
   * Provides default values for HTTP requests. To stay portable across different HTTP clients, it's recommended to only use these options,
   * which cds.test supports across all clients:
   * - `baseURL` as defined in Axios
   * - `auth` as defined in Axios
   * - `headers` as defined in Fetch API and Axios
   * - `validateStatus` as defined in Axios (default: status < 200 && status >= 300)
   *
   * In addition, you can use all of the config options understood by the underlying HTTP client, that is, for Fetch API,
   * its RequestInit options, and for Axios, its request config options.
   */
  get defaults (): AxiosRequestConfig & RequestInit

  get: AxiosInstance['get'] & TaggedTemplateRequest

  put: AxiosInstance['put'] & TaggedTemplateRequest

  post: AxiosInstance['post'] & TaggedTemplateRequest

  patch: AxiosInstance['patch'] & TaggedTemplateRequest

  delete: AxiosInstance['delete'] & TaggedTemplateRequest

  options: AxiosInstance['options'] & TaggedTemplateRequest

  get GET (): Axios['get']

  get PUT (): Axios['put']

  get POST (): Axios['post']

  get PATCH (): Axios['patch']

  get DELETE (): Axios['delete']

  get OPTIONS (): Axios['options']

}

declare class DataUtil {

  delete (db?: Service): Promise<void>

  reset (db?: Service): Promise<void>

  /**
   * @deprecated if needed, call `reset()`, considering test performance
   */
  autoReset (enabled: boolean): this

}

declare class Test extends Axios {

  test: Test

  run (cmd: string, ...args: string[]): this

  in (...paths: string[]): this

  silent (): this

  /**
   * @deprecated Server log is shown by default. Use `log()` to get control over it.
   */
  verbose (v: boolean): this

  /**
   * @deprecated Either use the {@link expect} property here or import `chai` in your test file.
   */
  get chai (): typeof chai

  /**
   * @deprecated Either use the {@link expect} property here or import `chai.assert` in your test file.
   */
  get assert (): typeof chai.assert

  /**
   * The `expect` assertion from the `chai` assertion library.
   *
   * For Jest, this returns a built-in implementation that covers the most common matchers with the standard `chai` API.
   * If your tests need more matchers, move to a different test runner such as Vitest, which supports ESM-only modules like `chai`.
   */
  get expect (): typeof chai.expect

  get data (): DataUtil

  get cds (): _cds

  log (): {
    output: string,
    clear(): void,
    release(): void,
  }

  then (r: (args: { server: http.Server, url: string }) => void): void

  // get sleep(): (ms: number) => Promise<void>;
  // get spy(): <T, K extends keyof T>(o: T, f: K) => T[K] extends (...args: infer TArgs) => infer TReturnValue
  //   ? Spy<TArgs, TReturnValue>
  //   : Spy;

}

// typings for spy inspired by @types/sinon
// interface Spy<TArgs extends any[] = any[], TReturnValue = any> {
//   (...args: TArgs): TReturnValue;
//   called: number;
//   restore(): (...args: TArgs) => TReturnValue;
// }

declare const test: {
  Test: typeof Test,

  /**
     * @see [capire docs](https://cap.cloud.sap/docs/node.js/cds-test#class-cds-test-test)
     */
  (dirname: string): Test,

  /**
     * @see [capire docs](https://cap.cloud.sap/docs/node.js/cds-test#class-cds-test-test)
     */
  (command: string, ...args: string[]): Test,

  in (dirname: string): Test,

  log: Test['log'],
}
