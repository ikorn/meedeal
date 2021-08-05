import Vue from 'vue'
import moment from 'moment'

var truncateFilter = function(text, length, clamp) {
  clamp = clamp || '...'
  if (!text) {
    return ''
  }
  if (text.length < length) {
    return text
  }
  return text.substring(0, length) + '…'
}
var dateFormatFilter = function(date, format) {
  return moment(date).format(format)
}

Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};

Vue.filter('truncate', truncateFilter)
Vue.filter('dateFormat', dateFormatFilter)
