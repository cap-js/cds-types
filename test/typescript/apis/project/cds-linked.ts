import { ArrayEsque, action, aspect, event, mixin, scalar, struct, type,  } from "../../../../apis/linked";

new aspect().kind === 'aspect'
// @ts-expect-error
new aspect().kind === 'aspect_'

new scalar().kind === 'type'
// @ts-expect-error
new scalar().kind === 'scalar_'

new type().kind === 'type'
// @ts-expect-error
new type().kind === 'type_'

new event().kind === 'event'
// @ts-expect-error
new event().kind === 'event_'

new action().kind === 'action'
// @ts-expect-error
new action().kind === 'action_'

mixin(class {}, class {})
// @ts-expect-error
mixin(42)

const arr: ArrayEsque<number> = undefined as unknown as ArrayEsque<number>
// @ts-expect-error
arr.length
const v: void = arr.forEach(x => x + 1)
const s: string[] = arr.map(x => ''+x)
const xs: number[] = arr.filter(x => x > 0)
const x: number | undefined = arr.find(x => x > 0)
const b: boolean = arr.some(x => x > 0)
for (const n of arr) n + 1