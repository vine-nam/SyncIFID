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
    runBtn: function() {
      axios
        //.get('/DB',{ crossDomain: true })
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
    useFlagBtn: function() {
      var sqls = this.query.toUpperCase().split(' ')
      for (let i = 0; i < sqls.length; i++) {
        if(/(|\n)WHERE/.exec(sqls[i]) ) {
          var str = ''
          for (let j = 0; j < sqls.length; j++) {
            if(/(|\n)WHERE/.exec(sqls[j]) ) {
              str += "\nWHERE USE_FLAG = 'Y' "
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
            this.query = this.query + "\nWHERE USE_FLAG = 'Y'"
          }
        }
      }
    }
  }
})

