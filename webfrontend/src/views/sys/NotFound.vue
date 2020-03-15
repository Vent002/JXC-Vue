<!--
 * @Date: 2020-03-04 09:21:12
 * @LastEditors: gxm
 * @LastEditTime: 2020-03-15 21:40:34
 * @FilePath: \webfrontend\src\views\sys\NotFound.vue
 -->
<template>
  <div>
    <div class="main" v-title data-title="404"></div>
    <div>404</div>
    <div>
      系统将在<span>{{countDown}}</span>秒后返回
    </div>
  </div>
</template>

<script>
  export default {
    name: "NotFound",
    data(){
      return{
        countDown:5,
      }
    },
    methods:{
      countDownTime(){
        if(!this.timer){
          this.timer = setInterval(() =>{
            if(this.countDown != 0){
              this.countDown--
            }else{
              this.countDown = 5
            }
          },1000)
        }
      }
    },
    created () {
      this.countDownTime()
    }
  }
  
</script>

<style scoped>

</style>
