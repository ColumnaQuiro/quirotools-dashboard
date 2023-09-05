export default defineNuxtRouteMiddleware((to) => {
  useFirebaseAuth()?.onAuthStateChanged((user) => {
    if (!user || !user.emailVerified) {
      return navigateTo({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  })
})
