<template>
  <div class="container">
    <input id="price" type="text" v-model="price" @input="(e) => setParams('price', e.target.value)" placeholder="цена">
    <input id="quantity" type="text" v-model="quantity" @input="(e) => setParams('quantity', e.target.value)" placeholder="кол-во">
    <input id="amount" type="text" v-model="amount" @input="(e) => setParams('amount', e.target.value)" placeholder="сумма">
    <button type="click" @click.prevent="send">Отправить</button>

    <br>

    <label for="price">{{ `Цена: ${getPrice}` }}</label>
    <label for="quantity">{{ `Кол-во: ${getQuantity}` }}</label>
    <label for="amount">{{ `Сумма: ${getAmount}` }}</label>
    <label for="">{{ `localStorage : ${getLocalStorageParams}` }}</label>

    <div class="list">
      <!-- в свободной форме отображать информацию о каждом событии -->
      <div v-for="(item, index) of history" :key="index">
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
        timeoutID: null,
        timeWait: 300
      }
    },
    computed: {
      getPrice () {
        return this.price
      },
      getQuantity () {
        return this.quantity
      },
      getAmount () {
        return /*this.price * this.quantity*/this.amount
      },
      getNonce () {
        return this.nonce
      },
      getParams () {
        return {
          price: this.getPrice,
          quantity: this.getQuantity,
          amount: this.getAmount,
          nonce: this.getNonce
        }
      },
      getLocalStorageParams () {
        return JSON.stringify(this.localStorageParams)
      },
      getHistory () {
        return this.history
      }
    },
    methods: {
      setParams (key, value) {
        if (this.timeoutID) {
          clearTimeout(this.timeoutID)
        }

        this.timeoutID = setTimeout(() => {
          this.setHistory({ [key]: value })
          this[key] = value

          if (!+this.price && +this.quantity && +this.amount) {
            this.price = +this.amount / +this.quantity
          } else if (+this.price && !+this.quantity && +this.amount) {
            this.quantity = +this.amount / +this.price
          } else if (+this.price && +this.quantity && !+this.amount) {
            this.amount = +this.quantity * +this.price
          } else if (+this.price && +this.quantity && +this.amount) {
            if (key === 'amount') {
              this.price = +this.amount / +this.quantity
            }
            if (key === 'price') {
              this.amount = +this.quantity * +this.price
            }
            if (key === 'quantity') {
              this.amount = +this.quantity * +this.price
            }
          }


        }, this.timeWait)
      },
      extractLocalStorageParams () {
        const obj = {
          price: localStorage.getItem('price') || 0,
          quantity: localStorage.getItem('quantity') || 0,
          amount: localStorage.getItem('amount') || 0,
          nonce: localStorage.getItem('nonce') || 0
        }
        this.localStorageParams = obj
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
        return new Promise((resolve) => {
          const status = this.getRandomInt(2)
          const wait = 1000
          const success = { success: status === 1 }
          setTimeout(() => resolve(success), wait)
        });
      },
      setHistory (record) {
        this.history.unshift(record)
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
      console.log('mounted: IndexPage')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  label {
      margin: 0 60px 0 60px;
  }
</style>
