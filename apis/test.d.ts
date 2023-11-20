import { AxiosInstance } from 'axios';
import chai from 'chai';
import * as http from 'http';
import { Service } from './services';

declare class Axios {
  get axios(): AxiosInstance;

  get     : AxiosInstance['get'];
  put     : AxiosInstance['put'];
  post    : AxiosInstance['post'];
  patch   : AxiosInstance['patch'];
  delete  : AxiosInstance['delete'];
  options : AxiosInstance['options'];

  get GET()     : Axios['get'];
  get PUT()     : Axios['put'];
  get POST()    : Axios['post'];
  get PATCH()   : Axios['patch'];
  get DELETE()  : Axios['delete'];
  get OPTIONS() : Axios['options'];
}

declare class DataUtil {
  delete(db?: Service): Promise<void>;
  reset(db?: Service): Promise<void>;
  /** @deprecated */ autoReset(enabled: boolean): this;
}

declare class Test extends Axios {

  test : Test

  run(cmd: string, ...args: string[]): this;
  in(...paths: string[]): this;
  silent(): this;
  /** @deprecated */ verbose(v: boolean): this;

  get chai(): typeof chai;
  get expect(): typeof chai.expect;
  get assert(): typeof chai.assert;
  get data(): DataUtil;
  get cds(): typeof import('./cds')

  log() : {
    output: string
    clear(): void
    release(): void
  }

  then(r: (args: { server: http.Server, url: string }) => void): void;

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

export = cds

declare class cds {
  test: {
    Test: typeof Test
    /**
     * @see [capire docs](https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run)
     */
    (projectDir: string): Test;
    /**
     * @see [capire docs](https://cap.cloud.sap/docs/node.js/cds-test?q=cds.test#run-2)
     */
    (command: string, ...args: string[]): Test;
    in (string) : Test
  }
}
