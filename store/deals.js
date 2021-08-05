import Vue from 'vue'
export const state = () => ({
  categories: [],
  tags: [],
  deal: null,
  form_data: initForm()
})

export const getters = {
  categories: state => state.categories,
  categoriesName: state => state.categories.map(item => item.name),
  tags: state => state.tags,
  deal: state => state.deal,
  formData: state => state.form_data,
  images: state => state.images
}

export const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_TAGS(state, tags) {
    state.tags = tags
  },
  SET_DEAL(state, deal) {
    state.deal = deal
  },
  SET_FORM_DATA(state, data) {
    state.form_data = data
  },
  VOTE_DEAL(state, vote) {
    state.deal.votes += vote
    state.deal.user_vote = vote
  },
  DELETE_ATTACHMENT(state, index) {
    if (index > -1 && state.deal.attachments.length - 1) {
      state.deal.attachments.splice(index, 1)
    }
  },
  // comments.
  SET_COMMENTS(state, { comments, next }) {
    if (comments.length) {
      state.deal.comments.push(...comments)
      state.deal.comments_next = next
    }
  },
  ADD_COMMENT(state, comment) {
    // TODO: state.deal.comments.push(comment)
    state.deal.comments_count += 1
  },
  VOTE_COMMENT(state, { index, vote }) {
    if (index > -1) {
      state.deal.comments[index].vote_score += vote
      state.deal.comments[index].user_vote = vote
    }
  },
  UPDATE_COMMENT(state, { index, comment }) {
    if (index > -1) {
      Vue.set(state.deal.comments, index, comment)
    }
  },
  DELETE_COMMENT(state, { deal, commentId }) {
    var index = findCommentIndexById(deal, commentId)
    while (index > -1 && state.deal.comments[index]) {
      state.deal.comments.splice(index, 1)
      state.deal.comments_count -= 1
      index = findCommentIndexById(deal, commentId)
    }
  }
}
export const actions = {
  async fetchCategories({ commit }) {
    try {
      const categories = await this.$dealRepo.getCategories()
      if (categories) commit('SET_CATEGORIES', categories)
    } catch {}
  },
  async fetchTags({ commit }) {
    try {
      const tags = await this.$dealRepo.getTags()
      if (tags) commit('SET_TAGS', tags.map(tag => tag.tag))
    } catch {}
  },
  // deals.
  async fetchPopularDeals({}, { categories, user }) {
    try {
      const response = await this.$dealRepo.getPopularDeals()
      return response
        ? sortDeals(
            response.deals.map(deal => formatDeal(categories, user, deal))
          )
        : []
    } catch {
      return []
    }
  },
  async fetchSponsoredDeals({}, { categories, user }) {
    try {
      const response = await this.$dealRepo.getSponsoredDeals()
      return response
        ? response.deals.map(deal => formatDeal(categories, user, deal))
        : []
    } catch {
      return []
    }
  },
  async fetchDeals({}, { categories, user, category, tag, page }) {
    try {
      const response = await this.$dealRepo.getDeals(
        category ? category.id : null,
        tag ? tag : null,
        page ? page : null
      )
      const deals = await response.deals.map(deal =>
        formatDeal(categories, user, deal)
      )
      return response
        ? { deals: deals, total_pages: response.num_pages }
        : { deals: [], total_pages: 0 }
    } catch {
      return { deals: [], total_pages: 0 }
    }
  },
  async searchDeals({}, { categories, user, keyword, page }) {
    try {
      const response = await this.$dealRepo.searchDeals(keyword, page)
      const deals = response.deals.map(deal =>
        formatDeal(categories, user, deal)
      )
      return response
        ? { deals: deals, total_pages: response.num_pages }
        : { deals: [], total_page: 0 }
    } catch {
      return { deals: [], total_pages: 0 }
    }
  },
  async fetchDealById({ commit }, { categories, user, id }) {
    try {
      const response = await this.$dealRepo.getDeal(id)
      const deal = response ? formatDeal(categories, user, response) : null
      if (deal) commit('SET_DEAL', deal)
      return deal != null
    } catch {
      return false
    }
  },
  updateForm({ commit }, formData) {
    commit('SET_FORM_DATA', formData)
  },
  async postDeal({}, { categories, user, deal, images }) {
    try {
      const response = await this.$dealRepo.postDeal(deal)
      const newDeal = response ? formatDeal(categories, user, response) : null
      if (newDeal) {
        if (images.length) {
          Promise.all(
            images.map(
              async image =>
                await this.$dealRepo.postDealAttachment(newDeal.id, image)
            )
          )
        }
        return newDeal
      } else return null
    } catch {
      return null
    }
  },
  async deleteAttachment({ getters, commit }, { url }) {
    await this.$dealRepo.deleteDealAttachment(url)
    const index = getters.deal.attachments.findIndex(
      attachment => attachment.url == url
    )
    commit('DELETE_ATTACHMENT', index)
  },
  async updateDeal({ commit }, { categories, user, deal }) {
    try {
      const response = await this.$dealRepo.postDeal(deal.id, deal)
      const updatedDeal = response
        ? formatDeal(categories, user, reponse.data)
        : null
      if (updatedDeal) commit('SET_DEAL', updatedDeal)
      return updatedDeal != null
    } catch {
      return false
    }
  },
  async voteDeal({ commit }, { id, vote }) {
    try {
      const response = await this.$dealRepo.voteDeal(id, vote)
      if (response) commit('VOTE_DEAL', response.user_vote)
      return response != null
    } catch {
      return false
    }
  },
  async reportDeal({}, { id, data }) {
    try {
      await this.$dealRepo.reportDeal(id, data)
      return true
    } catch {
      return false
    }
  },
  // comments.
  async fetchCommentsByDealId({ commit }, { user, dealId, page }) {
    try {
      const response = await this.$dealRepo.getComments(dealId, page)
      const comments = response
        ? response.comments.comments.map(comment =>
            formatComment(user, comment)
          )
        : null
      if (comments)
        commit('SET_COMMENTS', {
          comments: comments,
          next: response.comments.next
        })
      return comments != null
    } catch {
      return false
    }
  },
  async postComment({ commit }, { dealId, user, detail }) {
    try {
      const response = await this.$dealRepo.postComment(dealId, user.id, detail)
      if (response) commit('ADD_COMMENT', formatComment(user, response))
      return response != null
    } catch {
      return false
    }
  },
  async voteComment({ commit }, { deal, commentId, vote }) {
    try {
      const response = await this.$dealRepo.voteComment(
        deal.id,
        commentId,
        vote
      )
      if (response)
        commit('VOTE_COMMENT', {
          index: findCommentIndexById(deal, commentId),
          vote: response.user_vote
        })
      return response != null
    } catch {
      return false
    }
  },
  async updateComment({ commit }, { deal, user, commentId, content }) {
    try {
      const response = await this.$dealRepo.updateComment(
        deal.id,
        commentId,
        content.trim()
      )
      if (response)
        commit('UPDATE_COMMENT', {
          index: findCommentIndexById(deal, commentId),
          comment: formatComment(user, response)
        })
      return response != null
    } catch {
      return false
    }
  },
  async deleteComment({ commit }, { deal, commentId }) {
    try {
      const response = await this.$dealRepo.deleteComment(deal.id, commentId)
      if (response)
        commit('DELETE_COMMENT', { deal: deal, commentId: commentId })
      return response != null
    } catch {
      return false
    }
  }
}

// format data.
function formatDeal(categories, currentUser, deal) {
  const category_name =
    deal.category && categories
      ? getCategoryNameById(categories, deal.category)
      : null
  const is_expired = deal.expired_on
    ? new Date().toISOString().substring(0, 10) >=
      deal.expired_on.substring(0, 10)
    : false
  const owner = formatUser(deal.posted_by)
  const image = formatDealImage(deal)
  return {
    id: deal.id,
    title: deal.title,
    detail: deal.detail,
    link: deal.link,
    image: image,
    category_name: category_name,
    category_value: deal.category,
    tags: deal.tags,
    expired_on: deal.expired_on,
    is_expired: is_expired,
    can_edit: currentUser && owner ? currentUser.id === owner.id : false,
    posted_by: owner,
    posted_on: deal.posted_on,
    votes: deal.votes || 0,
    user_vote: deal.user_vote,
    views_count: deal.views_count,
    attachments:
      deal && deal.attachments
        ? deal.attachments.map(attachment => formatAttachment(attachment))
        : [],
    comments:
      deal && deal.comments
        ? deal.comments.comments.map(comment =>
            formatComment(currentUser, comment)
          )
        : [],
    comments_count:
      deal && deal.comments ? deal.comments.count : deal.comments_count,
    comments_next: deal && deal.comments ? deal.comments.next : null
  }
}
function formatDealImage(deal) {
  if (!deal) return `/images/deal.png`
  const regex = /<img[^>]+src="([^">]+)/g
  const match = regex.exec(deal.detail)
  return deal.image || (match ? match[1] : `/images/deal.png`)
}
function formatComment(currentUser, comment) {
  const owner = formatUser(comment.posted_by)
  return {
    id: comment.id,
    content: comment.content,
    posted_by: owner,
    posted_on: comment.posted_on,
    is_owner: currentUser && owner ? owner.id === currentUser.id : false,
    votes: comment.vote_score || 0,
    user_vote: comment.user_vote
  }
}
function formatUser(user) {
  return {
    id: user.id,
    display_name: user.display_name || `unknown user`,
    avatar_url: user.avatar_url || `/images/avatar.png`,
    level: user.level,
    reputation: user.reputation,
    post_count: user.post_count,
    signature: user.signature,
    created_at: user.created_at
  }
}
function formatAttachment(attachment) {
  return {
    name: attachment.name,
    thumbnail_url: attachment.thumbnail_url,
    url: attachment.url
  }
}
function findCommentIndexById(deal, commentId) {
  return deal.comments.findIndex(comment => comment.id == commentId)
}
function getCategoryNameById(categories, id) {
  const category = categories.find(category => category.id === id)
  return category ? category.name : null
}
function getCategoryValueByName(categories, name) {
  const category = categories.find(category => category.name == name)
  return category ? category.id : null
}
function sortDeals(deals) {
  const expired = deals
    .filter(deal => deal.is_expired)
    .sort((item1, item2) => item1.posted_on < item2.posted_on)
  const active = deals
    .filter(deal => !deal.is_expired)
    .sort((item1, item2) => item1.posted_on < item2.posted_on)
  return active.concat(expired)
}
function initForm() {
  return {
    title: null,
    url: null,
    detail: null,
    expiration_date: null,
    category: null,
    tags: [],
    images: {
      files: [],
      data: []
    }
  }
}
