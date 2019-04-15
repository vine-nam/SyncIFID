// const params = new URLSearchParams();
// params.append('param1', 'value1');
// params.append('param2', 'value2');

axios.defaults.baseURL = 'http://localhost:3001';

var editor = new Vue({
  el: '#editor',
  data: {
    query: 'SELECT * FROM TB_C_IFINFO ',
    info: null
  },
  methods: {
    getBtn: function() {
      axios
        .get('/DB')
        .then(response => (
          this.info = response.data.root
          ), (error) => {
            console.log(error)
            this.info = error
          }
        )
    },
    postBtn: function() {
      axios
        .post('/DB', {sql: this.query})
        .then(response => (
          this.info = response.data.root
          ), (error) => {
            console.log(error)
            this.info = error
          }
        )
    },
    defaultBtn: function() {
      this.query = 'SELECT * FROM TB_C_IFINFO '
    },
    whereBtn: function(type) {
      var sqls = this.query.toUpperCase().split(' ')
      for (let i = 0; i < sqls.length; i++) {
        if(/(|\n)WHERE/.exec(sqls[i]) ) {
          var str = ''
          for (let j = 0; j < sqls.length; j++) {
            if(/(|\n)WHERE/.exec(sqls[j]) ) {
                if(type === 'useFlag') {
                    str += "\nWHERE USE_FLAG = 'Y' "
                } else if(type === 'ifId') {
                    str += "\nWHERE IF_ID = '' "
                }
              if(j !== sqls.length-1 & sqls[j+1] !== "") {
                str += "\n  AND "
              }
            } else {
              str += sqls[j] + " "
            }
            i = sqls.length;
            this.query = str
          }
        } else {
          if(i === sqls.length-1) {
            if(type === 'useFlag') {
                this.query = this.query + "\nWHERE USE_FLAG = 'Y' "
            } else if(type === 'ifId') {
                this.query = this.query + "\nWHERE IF_ID = '' "
            }
          }
        }
      }
    }
  }
})

