// 1

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// 1
import { ApolloLink } from 'apollo-link'

import 'tachyons'
import Vue from 'vue'
// 2
import VueApollo from 'vue-apollo'
import { GC_USER_ID, GC_AUTH_TOKEN  } from './constants/settings'
import App from './App'
import router from './router'
Vue.config.productionTip = false

// 3
const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'https://api.graph.cool/simple/v1/cjs5snl0w22990114nl9f8sgr'
})

// 要放在httpLink 和 ApolloClient之间
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem(GC_AUTH_TOKEN)
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null
    }
  })

  return forward(operation)
})

// 4
const apolloClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

// 5
Vue.use(VueApollo)

// 6
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  }
})
let userId = localStorage.getItem(GC_USER_ID)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // 7
  provide: apolloProvider.provide(),
  router,
  // 2
  data: {
    userId
  },
  render: h => h(App)
})