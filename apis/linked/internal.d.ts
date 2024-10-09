/**
 * The classes in here are used to work around naming conflicts with Node builtin types.
 * By defining them with a suffix we can then alias them with a const in linked/classes.d.ts:
 *
 * ```ts
 * const boolean: typeof boolean_
 * ```
 *
 * But we don't want to expose these classes to the user,
 * which would inevitably happen if they were part of linked/classes.d.ts
 * so we need stow them away in this internal module instead.
 */

import type { scalar } from './classes'

declare class number_ extends scalar { }
declare class string_ extends scalar { 
  length?: number
}
declare class boolean_ extends scalar { }
