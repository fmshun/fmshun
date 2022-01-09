<template>
  <div class="wait">
    <span>
      <img src="./images/loading.gif" alt="loading" />
    </span>
  </div>
</template>
<style scoped>
.wait {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: #fff;
}
.wait img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25px;
  height: 27px;
  transform: translate(-50%, -50%);
}
</style>
