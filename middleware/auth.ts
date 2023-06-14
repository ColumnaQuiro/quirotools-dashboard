import { User } from '@firebase/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const noNeedsAuthentication = to.path === '/create-account'
  const user: User = await getCurrentUser()

  if (noNeedsAuthentication) {
    return
  }
  if (!user || !user.emailVerified) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
})
