import { createStore } from "vuex"

const store = createStore({
  state: {
    val: 10
  },
  mutations: {
    inc(state) {
      state.val++
    },
    dec(state) {
      state.val--
    }
  },
  getters: {
    val: (store) => store.val
  }
})

export default store

