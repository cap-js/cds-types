import cds from '../../../..'
import { User } from '../../../../apis/cds'

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
new (class extends User {
  is(): boolean {
    return true
  }
})()
