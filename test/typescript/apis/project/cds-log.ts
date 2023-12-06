import cds from '../../../..'
import * as winston from "winston"

cds.log('foo').debug('message')
cds.log('foo', 1)
cds.log('foo|bar', 1)
cds.log('foo', 'debug')
cds.log('foo', { level: 1, prefix: 'pref' })
cds.log('foo', { label: 'foo', prefix: 'pref' })
cds.log('foo', 'debug')._debug
cds.log('foo', 'debug')._trace
cds.log('foo', 'debug')._info
cds.log('foo', 'debug')._warn
cds.log('foo', 'debug')._error

cds.log.format = (id, level, ...args) => { return [] }
cds.log('foo').setFormat((id, level, ...args) => { return [] })

const dbg = cds.debug('foo')
// dbg()
dbg && dbg('message')
dbg?.('message')

// winstonlogger
cds.log.Logger = cds.log.winstonLogger({
    format: winston.format.prettyPrint(),
    transports: [
        new winston.transports.Console()
    ],
    level: 'info',
    exitOnError: true,
    silent: false,
    levels: winston.config.npm.levels
})
