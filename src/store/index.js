import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        price: 0,
        quantity: 0,
        amount: 0,
        localStorageParams: {},
        history: [],
    },
    mutations: {
        updateInputParams (state, { key, value }) {
          state[key] = value

          if (!+state.price && +state.quantity && +state.amount) {
            state.price = +state.amount / +state.quantity
          } else if (+state.price && !+state.quantity && +state.amount) {
            state.quantity = +state.amount / +state.price
          } else if (+state.price && +state.quantity && !+state.amount) {
            state.amount = +state.quantity * +state.price
          } else if (+state.price && +state.quantity && +state.amount) {
            if (key === 'amount') {
              state.price = +state.amount / +state.quantity
            }
            if (key === 'price') {
              state.amount = +state.quantity * +state.price
            }
            if (key === 'quantity') {
              state.amount = +state.quantity * +state.price
            }
          }
        },
        updateLocalStorageParams (state, params) {
            state.localStorageParams = params
        },
        updateHistory (state, record) {
            state.history.unshift(record)
        },
        extractLocalStorageParams (state) {
            const obj = {
              price: localStorage.getItem('price') || 0,
              quantity: localStorage.getItem('quantity') || 0,
              amount: localStorage.getItem('amount') || 0,
              nonce: localStorage.getItem('nonce') || 0
            }
            state.localStorageParams = obj
        }
    },
    actions: {
        reqFormParams () {
            return new Promise((resolve) => {
                const status = Math.floor(Math.random() * 2)
                const wait = 1000
                const success = { success: status === 1 }
                setTimeout(() => resolve(success), wait)
            });
        }
    }
});