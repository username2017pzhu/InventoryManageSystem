<template>
  <div>
    <v-chart :force-fit="true" :height="height" :data="data" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-line position="month*money" color="editor" />
      <v-point position="month*money" color="editor" :size="4" :v-style="style" :shape="'circle'" />
    </v-chart>
  </div>
</template>

<script>
  import DataSet from '@antv/data-set';
  import axios from 'axios'
  export default {
    data() {
      return {
        data: [],
        scale: [{
          dataKey: 'month',
          min: 1,
          max: 12,
        }],
        height: 550,
        style: {
          stroke: '#fff',
          lineWidth: 1
        },
        obj: {}
      };
    },
    methods: {
      renderChart() {
        axios.get('api/salesSum/empSalesAn')
          .then(res => {
            let names = []
            let sales = []
            let monthSet = new Set()
            let obj = []
            res.data.map(el => {
              monthSet.add(el.month)
              sales.push(el.totalSales)
              names.push(el.editor)
            })
            monthSet = [...monthSet]
            monthSet.map(e => {
              obj.push({
                'month': e
              })
            })
            names = names.concat(sales)
            let arr = []
            for (let i = 0; i < sales.length; i++) {
              let str = ''
              switch (monthSet.length) {
                case 1:
                  str = `{"${names[i]}":${String(names[i+names.length/2])}}`
                case 2:
                  str =
                    `{"${names[i]}":${String(names[i+names.length/2])},"${names[i+1]}":${String(names[i+1+names.length/2])}}`
                  break;
                case 3:
                  str =
                    `{"${names[i]}":${String(names[i+names.length/2])},"${names[i+1]}":${String(names[i+1+names.length/2])},"${names[i+2]}":${String(names[i+2+names.length/2])}}`
                  break;
              }

              arr.push(str)
            }
            let t1 = []
            for (let i = 0; i < monthSet.length * 2; i += 2) {
              t1.push(arr[i])
            }
            let t2 = []
            t1.map(e => {
              t2.push(JSON.parse(e))
            })
            t2.map((el, i) => {
              el['month'] = `${monthSet[i]}月`
            })
            let newNames = Object.keys(t2[0])
            delete(newNames[newNames.length - 1])
            const dv = new DataSet.View().source(t2);
            dv.transform({
              type: 'fold',
              fields: newNames,
              key: 'editor',
              value: 'money',
            });
            this.data = dv.rows;
          })
          .catch(err => console.log(err))
      }
    },
    created() {
      this.renderChart()
    }
  };

</script>
