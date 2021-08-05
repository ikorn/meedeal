export default $axios => ({
  getDeals(category, tag, page) {
    var path = `deals/`
    if (tag || category || (page && page > 1)) path += `?`
    if (category) path += `category=${category}&`
    if (tag) path += `tag=${tag}&`
    if (page && page > 1) path += `page=${page}`
    return $axios.$get(path)
  },
  getSponsoredDeals() {
    return $axios.$get(`deals/sponsored/`)
  },
  getPopularDeals() {
    return $axios.$get(`deals/popular/`)
  },
  searchDeals(keyword, page) {
    let path = `deals/`
    if (keyword) path += `?search=${keyword}`
    if (page && page > 1) path += `&page=${page}`
    return $axios.$get(path)
  },
  getDeal(id) {
    return $axios.$get(`deals/${id}/`)
  },
  postDeal(deal) {
    return $axios.$post(`deals/`, deal)
  },
  postDealAttachment(dealId, image) {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    const formData = new FormData()
    formData.append('upload', image)
    return $axios.$post(`deals/${dealId}/attach/`, formData, config)
  },
  updateDeal(id, deal) {
    return $axios.$patch(`deals/${id}/`, deal)
  },
  voteDeal(id, vote) {
    return $axios.$post(`deals/${id}/vote/`, {
      action: vote
    })
  },
  reportDeal(id, data) {
    return $axios.$post(`deals/${id}/report/`, { content: data })
  },
  getComments(id, page) {
    return $axios.$get(`deals/${id}/replies/?page=${page}`)
  },
  postComment(dealId, userId, content) {
    return $axios.$post(`deals/${dealId}/reply/`, {
      user_id: userId,
      content: content
    })
  },
  updateComment(dealId, commentId, content) {
    return $axios.$patch(`deals/${dealId}/replies/${commentId}/`, {
      content: content
    })
  },
  deleteComment(dealId, replyId) {
    return $axios.$delete(`deals/${dealId}/replies/${replyId}/`)
  },
  voteComment(dealId, replyId, vote) {
    return $axios.$post(`deals/${dealId}/replies/${replyId}/vote/`, {
      action: vote
    })
  },
  getCategories() {
    return $axios.$get(`deals/categories`)
  },
  getTags() {
    return $axios.$get(`deals/tags/`)
  }
})
