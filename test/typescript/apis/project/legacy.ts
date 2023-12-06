// verifies typical legacy import patterns
// through the legacy facade in @sap/cds/apis/...

import { ApplicationService, DatabaseService, QueryAPI, Transaction, Service } from '@sap/cds/apis/services'
import { Request, User } from '@sap/cds/apis/events'
import { Definition, CSN } from '@sap/cds/apis/csn'
import { LinkedDefinition } from '@sap/cds/apis/linked'
