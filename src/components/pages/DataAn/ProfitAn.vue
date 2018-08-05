<template>
  <div>
    <v-chart :force-fit="true" :height="height" :data="data" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-line position="month*money" color="item" />
      <v-point position="month*money" color="item" :size="4" :v-style="style" :shape="'circle'" />
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
      };
    },
    methods: {
      renderChart() {
        axios.get('api/salesSum/profitAn')
          .then(res => {
            let sourceData = [];
            res.data.map(el => {
              let obj = {}
              obj['month'] = `${el.month}月`,
                obj['销售总额'] = el.totalSales
              obj['销售利润'] = el.totalProfit
              sourceData.push(obj)
            })
            const dv = new DataSet.View().source(sourceData);
            dv.transform({
              type: 'fold',
              fields: ['销售总额', '销售利润'],
              key: 'item',
              value: 'money',
            });
            this.data = dv.rows;
          })
          .catch(err=>console.log(err))
      }
    },
    created() {
      this.renderChart()
    }
  };

</script>
