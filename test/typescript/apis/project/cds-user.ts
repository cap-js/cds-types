import cds, { User } from '@sap/cds'

// accepts no args
const user = new User()

// accepts user object
new User(user)

// accepts a user look-alike
const manuallyCreatedUser = new User({ id: 'ID', roles: {}, attr: {} })
if (Array.isArray(manuallyCreatedUser.roles)) manuallyCreatedUser.roles.push('identified-user')

// accepts a string with user ID
new User('ID')

user.id

// should show as deprecated
user.tenant

// should show as deprecated
user.locale

user.is('someRole')

const privileged = new cds.User.Privileged()
privileged.is()
privileged.id === 'privileged'
const readyToUsePrivileged = cds.User.privileged
readyToUsePrivileged.is()
readyToUsePrivileged.id === 'privileged'

const anonymous = new cds.User.Anonymous()
anonymous.is()
anonymous.id === 'anonymous'
const readyToUseAnonymous = cds.User.anonymous
readyToUseAnonymous.is()
readyToUseAnonymous.id === 'anonymous'

const readyToUseDefault = cds.User.default
readyToUseDefault.id === 'anonymous' // since the default default is cds.User.anonymous

new (class extends User {
  is(): boolean {
    return true
  }
})()

// authInfo is typed and optional (only present when an xssec strategy is active)
const token = user.authInfo?.token
const payload = token?.getPayload()
const azp = token?.azp
const jwt = token?.jwt

// can be passed when constructing a user with an authInfo (e.g. in tests or custom middleware)
new User({ id: 'svc', roles: {}, attr: {}, authInfo: user.authInfo })
