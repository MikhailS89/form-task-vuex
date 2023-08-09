<template>
  <div class="container">
    <input id="price" type="text" :value="getPrice" @input="(e) => setParams('price', e.target.value)" placeholder="цена">
    <input id="quantity" type="text" :value="getQuantity" @input="(e) => setParams('quantity', e.target.value)" placeholder="кол-во">
    <input id="amount" type="text" :value="getAmount" @input="(e) => setParams('amount', e.target.value)" placeholder="сумма">
    <button type="click" @click.prevent="send">Отправить</button>

    <br>

    <label for="price">{{ `Цена: ${getPrice}` }}</label>
    <label for="quantity">{{ `Кол-во: ${getQuantity}` }}</label>
    <label for="amount">{{ `Сумма: ${getAmount}` }}</label>
    <label for="">{{ `localStorage : ${getLocalStorageParams}` }}</label>

    <hr>

    <div class="list">
      <div v-for="(item, index) of getHistory" :key="index">
        <br>
        {{ JSON.stringify(item) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'IndexPage',
    props: {
      msg: String
    },
    data () {
      return {
        price: 0,
        quantity: 0,
        amount: 0,
        nonce: 0,
        localStorageParams: {},
        history: [],
        // inputHistory: [],
        timeoutID: null,
        timeWait: 300
      }
    },
    computed: {
      getPrice () {
        return this.$store.state.price
      },
      getQuantity () {
        return this.$store.state.quantity
      },
      getAmount () {
        return this.$store.state.amount
      },
      getNonce () {
        return this.$store.state.nonce
      },
      getParams () {
        return {
          price: this.getPrice,
          quantity: this.getQuantity,
          amount: this.getAmount,
          nonce: this.nonce
        }
      },
      getLocalStorageParams () {
        return JSON.stringify(this.$store.state.localStorageParams)
      },
      getHistory () {
        return this.$store.state.history
      }
    },
    methods: {
      setParams (key, value) {
        if (this.timeoutID) {
          clearTimeout(this.timeoutID)
        }

        this.timeoutID = setTimeout(() => {

          // this.inputHistory.push({ [key]: value })
          // if (this.inputHistory.length > 3) {
          //   this.inputHistory.shift()
          // }
          // this.setHistory({ inputs: this.inputHistory })

          this.setHistory({ [key]: value })
          this.$store.commit('updateInputParams', { key, value })

        }, this.timeWait)
      },
      extractLocalStorageParams () {
        this.$store.commit('extractLocalStorageParams')
      },
      setlocalStorageParams (key, value) {
        localStorage.setItem(key, value)
      },
      clearlocalStorageParams () {
        delete localStorage.price
        delete localStorage.quantity
        delete localStorage.amount
        delete localStorage.nonce
      },
      getRandomInt (max) {
        return Math.floor(Math.random() * max);
      },
      getRandomIntRange (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      reqFormParams () {
        return this.$store.dispatch('reqFormParams')
      },
      setHistory (record) {
        this.$store.commit('updateHistory', record)
      },
      async send () {
        if (this.getAmount % 2 !== 0) { return }

        this.nonce = this.getRandomIntRange(this.nonce, this.nonce + 50)

        this.setHistory({ data: this.getParams, storage: JSON.parse(this.getLocalStorageParams) })

        const response = await this.reqFormParams()

        if (response && response.success) {
          const entries = Object.entries(this.getParams)

          entries.forEach(([key, value]) => {
            this.setlocalStorageParams(key, value)
          })
        }

        this.extractLocalStorageParams()
        this.setHistory({ response, storage: JSON.parse(this.getLocalStorageParams) })

        console.group('send: ')
        console.log('success: ', response.success)
        console.log('getLocalStorageParams: ', this.getLocalStorageParams)
        console.log('history: ', this.history)
        console.groupEnd()
      }
    },
    mounted () {
      this.clearlocalStorageParams()
    }
}
</script>

<style scoped>
  label {
      margin: 0 30px 0 30px;
  }
</style>
