<template>
  <div class="siderbar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" :collapse="isCollapse" background-color="#0f2540" text-color="#f4f4f4"
      active-text-color="#ffd04b" router unique-opened>
      <el-radio-group v-model="isCollapse" style="padding-left:10px" size="small">
        <el-button class="collapse-btn" type="text" size="medium" :label='isCollapse' @click="changeCollapse">
          <i :class="classObj"></i>
        </el-button>
      </el-radio-group>
      <template v-for="item in items">
        <template v-if="item.subItems">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item v-for="subitem in item.subItems" :key="subitem.index" :index="subitem.index">
              {{subitem.title}}
            </el-menu-item>
          </el-submenu>
        </template>
        <el-menu-item v-else :key="item.index" :index="item.index">
          <i :class="item.icon"></i>
          <template slot="title">
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
  import admItems from '@/assets/data/admSiderItems'
  import editorItems from '@/assets/data/editorSiderItems.json'
  import checkToken from '@/token/checkToken'
  export default {
    data() {
      return {
        items: [],
        isCollapse: true
      }
    },
    methods: {
      changeCollapse() {
        this.isCollapse = !this.isCollapse
      },
      addMenu() {
        const token = this.$store.state.user.token
        if (token) {
          const decoded = checkToken(token, 'cysto');
          this.items = decoded.role === 'admin' ? admItems : editorItems
        } else {
          return false
        }
      }
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('', '/')
      },
      classObj: function () {
        return {
          "el-icon-d-arrow-right": this.isCollapse == true,
          "el-icon-d-arrow-left": this.isCollapse == false
        }
      },
    },
    beforeRouteEnter() {
      return this.$route.path.replace(location)
    },
    mounted() {
      this.addMenu()
    },
  }

</script>
<style scoped>
  /* .el-menu-vertical-demo,.el-menu--collapse{
  width: 165px;
} */

  .collapse-btn {
    margin-left: 15px;
    color: #f4f4f4
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 165px;
    height: 100%;
  }

  .siderbar {
    height: 100%;
  }

  .el-menu-item {
    max-width: 165px;
  }

  .el-submenu .el-menu-item {

    min-width: 165px;
  }

  .is-opened {
    /* max-width: 165px; */
    background-color: red
  }

  .siderbar>ul {
    height: 100%;
  }

  .el-submenu i,
  .el-menu-item i {
    font-size: 20px;
    color: white
  }

</style>
