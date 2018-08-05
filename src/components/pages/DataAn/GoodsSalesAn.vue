<template>
  <div>
    <v-chart :force-fit="true" :height="height" :padding="[ 40, 40, 130, 40 ]" :data="data" :scale="scale">
      <v-coord type="polar" />
      <v-axis :data-key="axis1Opts.dataKey" :label="axis1Opts.label" :tickLine="axis1Opts.tickLine" :line="axis1Opts.line" />
      <v-axis :data-key="axis2Opts.dataKey" :grid="axis2Opts.grid" :tickLine="axis2Opts.tickLine" :label="axis2Opts.label" />
      <v-legend dataKey="GoodsName" :itemWidth="50" />
      <v-interval :position="interval1Opts.position" :color="interval1Opts.color" :label="interval1Opts.label" :v-style="interval1Opts.style"
      />
    </v-chart>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    data() {
      return {
        height: 550,
        data: [],
        scale: [{
          dataKey: 'Profit',
          min: 0,
        }],
        axis1Opts: {
          dataKey: 'Profit',
          label: null,
          tickLine: null,
          line: {
            stroke: '#E9E9E9',
            lineDash: [3, 3]
          }
        },
        axis2Opts: {
          dataKey: 'GoodsName',
          grid: {
            align: 'center'
          },
          tickLine: null,
          label: {
            Offset: 10,
            textStyle: {
              textAlign: 'center' // 设置坐标轴 label 的文本对齐方向
            }
          }
        },
        interval1Opts: {
          position: 'GoodsName*Profit',
          color: 'GoodsName',
          label: ['Profit', {
            offset: -15,
            textStyle: {
              textAlign: 'center',
              fontSize: 11,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            }
          }],
          style: {
            lineWidth: 1,
            stroke: '#fff',
          },
        },
      };
    },
    methods: {
      renderChart() {
        axios.get('api/goodsSalesSum/queryAll')
          .then(res => {
            res.data.map(el => {
              let obj = {}
              obj['GoodsName'] = el.goodsName
              obj['Profit'] = el.salesProfit
              this.data.push(obj)
            })
          })
          .catch(err => console.log(err))
      }
    },
    created() {
      this.renderChart()
    }
  };

</script>
