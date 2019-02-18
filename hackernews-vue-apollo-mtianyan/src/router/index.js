import Vue from "vue";
import Router from "vue-router";

// 1
import CreateLink from "../components/CreateLink";
import LinkList from "../components/LinkList";
import AppLogin from "../components/AppLogin";
// 1
import Search from "../components/Search";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: '/new/1'
    },
    {
      path: "/create",
      component: CreateLink
    },
    {
      path: "/login",
      component: AppLogin
    },
     {
    path: '/new/:page',
    component: LinkList
  },
    // 2
    {
      path: "/search",
      component: Search
    },
     {
    path: '/top',
    component: LinkList
  }
  ],
  // 3
  mode: "history"
});
