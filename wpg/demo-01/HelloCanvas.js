function main() {
  // 获取<canvas>元素
  var canvas = document.getElementById('app');

  // 获取webgl绘图上下文
  var gl = getWebGLContext(canvas); // 不引入库会报错
  // var gl = canvas.getContext('webgl');   // 不引入库写法

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // 指定清空<canvas>颜色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空<canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
