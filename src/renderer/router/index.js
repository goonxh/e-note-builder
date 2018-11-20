import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'note',
      component: require('@/components/note').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
