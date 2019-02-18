<template>
  <div class="flex mt2 items-start">
    <div class="flex items-center">
      <span class="gray">{{linkNumber}}.</span>
      <div v-if="userId" class="ml1 gray f11 upvote" @click="voteForLink()">▲</div>
    </div>
    <div class="ml1">
      <a :href="link.url" class="link">{{link.description}} ({{link.url}})</a>
      <div class="f6 lh-copy gray">
        {{link.votes.length}} votes | by {{link.postedBy ? link.postedBy.name : 'Unknown'}} {{timeDifferenceForDate(link.createdAt)}}
      </div>
    </div>
  </div>
</template>

<script>
import { ALL_LINKS_QUERY, CREATE_VOTE_MUTATION } from '../constants/graphql'
import { GC_USER_ID } from '../constants/settings'
import { timeDifferenceForDate } from '../utils'
  export default {
    name: 'LinkItem',
    computed: {
      userId () {
        return this.$root.$data.userId
      },
      linkNumber () {
        if (this.$route.path.includes('new')) {
          return (this.pageNumber - 1) * this.linksPerPage + (this.index + 1)
        } else {
          return this.index + 1
        }
      },
      voteForLink () {
  const userId = localStorage.getItem(GC_USER_ID)
  const voterIds = this.link.votes.map(vote => vote.user.id)
  if (voterIds.includes(userId)) {
    alert(`User (${userId}) already voted for this link.`)
    return
  }
  const linkId = this.link.id
  this.$apollo.mutate({
    mutation: CREATE_VOTE_MUTATION,
    variables: {
      userId,
      linkId
    },
    // 执行突变后更新缓存
    update: (store, { data: { createVote } }) => {
    this.updateStoreAfterVote(store, createVote, linkId)
  }
  })
}
    },
    props: ['link', 'index'],
    methods: {
      timeDifferenceForDate,
      updateStoreAfterVote (store, createVote, linkId) {
  // 1
  const data = store.readQuery({
    query: ALL_LINKS_QUERY
  })

  // 2
  const votedLink = data.allLinks.find(link => link.id === linkId)
  votedLink.votes = createVote.link.votes

  // 3
  store.writeQuery({ query: ALL_LINKS_QUERY, data })
}
    }
  }
</script>

<style scoped>
  .upvote {
    cursor: pointer;
  }

  .link {
    text-decoration: none;
    color: black;
  }
</style>