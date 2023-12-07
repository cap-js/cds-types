// verifies typical legacy import patterns
// through the legacy facade in @sap/cds/apis/...

import * as cds from '@sap/cds/apis/cds'

import { Association, entity } from '@sap/cds/apis/core'
import { CREATE, SELECT, Query } from '@sap/cds/apis/cqn'
import { Definition, CSN } from '@sap/cds/apis/csn'
import { Request, User } from '@sap/cds/apis/events'
import { ArrayConstructable, Constructable } from '@sap/cds/apis/internal/inference'
import { LinkedDefinition } from '@sap/cds/apis/linked'
import { ConstructedQuery } from '@sap/cds/apis/ql'
import { ApplicationService, DatabaseService, QueryAPI, Transaction, Service } from '@sap/cds/apis/services'

// works with sap/cds >= 7.5
// import { User as coreUser } from '@sap/cds/apis/core'
// import { Logger } from '@sap/cds/apis/log'
