import { LinkedCSN, action, aspect, entity, event, mixin, scalar, struct, type,  } from '../../../../apis/linked';
import { _ArrayLike } from '../../../../apis/internal/util';

const linkedCsn = undefined as unknown as LinkedCSN

linkedCsn.exports[0].name
linkedCsn.exports['foo'].name
linkedCsn.exports('foo').bar
const es: entity[] = linkedCsn.all(x => Boolean(x.name), linkedCsn.entities)
// @ts-expect-error
const ts: type[] = linkedCsn.all(x => Boolean(x.name), linkedCsn.entities)
const one: entity | undefined = linkedCsn.find(x => Boolean(x.name), linkedCsn.entities)
for (const each of linkedCsn.each(e => true, linkedCsn.entities)) each.keys

new entity().kind === 'entity'
new entity().keys.find
new entity().associations.find(Boolean)
new entity().compositions.find(Boolean)
new entity().actions.find(Boolean)
new entity().texts?.kind === 'entity'
new entity().drafts?.kind === 'entity'
new entity().is_entity === true
new entity().is_struct === true
new entity().elements.find(x => x.items.kind === 'type')
new entity().items?.kind
new entity().name
// @ts-expect-error
new entity().FOO

new struct().name

new type().name
new type().items
//new type().is('Association')

// @ts-expect-error
new entity().elements.find(x => x.items.charAt(0)) // .elements should not be FQN from CSN anymore, but linked

new aspect().kind === 'aspect'
// @ts-expect-error
new aspect().kind === 'aspect_'

new scalar().kind === 'type'
// @ts-expect-error
new scalar().kind === 'scalar_'

new type().kind === 'type'
// @ts-expect-error
new type().kind === 'type_'

new event().elements
new event().kind === 'event'
// @ts-expect-error
new event().kind === 'event_'

new action().kind === 'action'
// @ts-expect-error
new action().kind === 'action_'

mixin(class {}, class {})
// @ts-expect-error
mixin(42)

const arr: _ArrayLike<number> = undefined as unknown as _ArrayLike<number>
// @ts-expect-error
arr.length
const v: void = arr.forEach(x => x + 1)
const s: string[] = arr.map(x => ''+x)
const xs: number[] = arr.filter(x => x > 0)
const x: number | undefined = arr.find(x => x > 0)
const b: boolean = arr.some(x => x > 0)
for (const n of arr) n + 1
