// const params = new URLSearchParams();
// params.append('param1', 'value1');
// params.append('param2', 'value2');

axios.defaults.baseURL = 'http://localhost:3001';

var id = 1;

function time() {
    var date = new Date();
    return "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]   ";
}

function addInfo(type, response) {
  var infos = {};
  infos.id = id++
  infos.time = time()
  infos.type = type
  infos.response = response
  return infos
}

var editor = new Vue({
  el: '#editor',
  data: {
    query: "SELECT * FROM TB_C_IFINFO \nWHERE USE_FLAG = 'Y' ",
    infoColumns: ['time', 'type', 'response'],
    infoData: []
  },
  methods: {
    getBtn: function() {
      axios
        .get('/IFID', {  params: {sql: this.query} })
        .then(response => (
          this.infoData.unshift(addInfo("GET", response.data.root.IF_ID))
          ), (error) => {
            console.log(error);
            this.infoData.unshift(addInfo("ERROR", error))
          }
        )
    },
    postBtn: function() {
      axios
        .post('/IFID', {sql: this.query})
        .then(response => (
          this.infoData.unshift(addInfo("POST", response.data.root.IF_ID))
          ), (error) => {
            console.log(error);
            this.infoData.unshift(addInfo("ERROR", error))
          }
        )
    },
    defaultBtn: function() {
      this.query = "SELECT * FROM TB_C_IFINFO \nWHERE USE_FLAG = 'Y' "
    },
    whereBtn: function(type) {
      var sqls = this.query.toUpperCase().split(' ');
      for (let i = 0; i < sqls.length; i++) {
        if(/(|\n)WHERE/.exec(sqls[i]) ) {
          var str = ''
          for (let j = 0; j < sqls.length; j++) {
            if(/(|\n)WHERE/.exec(sqls[j]) ) {
                if(type === 'U') {
                    str += "\nWHERE USE_FLAG = 'Y' "
                } else if(type === 'I') {
                    str += "\nWHERE IF_ID LIKE '%%' "
                } else if(type === 'W') {
                    str += "\nWHERE WORK_GROUP LIKE '%%' "
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
            if(type === 'U') {
                this.query = this.query + "\nWHERE USE_FLAG = 'Y' "
            } else if(type === 'I') {
                this.query = this.query + "\nWHERE IF_ID LIKE '%%' "
            } else if(type === 'W') {
                 this.query = this.query + "\nWHERE WORK_GROUP LIKE '%%' "
            }
          }
        }
      }
    }
  }
})
