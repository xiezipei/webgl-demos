/**
 * 顶点着色器（GLSL ES语言）
 */
const VSHADER_SOURCE = `
 attribute vec4 a_Position;
 void main() {
     gl_Position = a_Position; // 设置坐标
     gl_PointSize = 10.0; // 设置尺寸
 }
`;

/**
 * 片着色器（GLSL ES语言）
 */
const FSHADER_SOURCE = `
   void main() {
       gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // 设置颜色
   }
`;

/**
 * 主函数
 * @returns
 */
function main() {
  // 获取<canvas>元素
  const canvas = document.getElementById('app');

  // 获取webgl绘图上下文
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // 获取attribute变量的存储位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // 注册鼠标点击事件响应函数
  canvas.onmousedown = function (ev) {
    click(ev, gl, canvas, a_Position);
  };

  // 将顶点位置传输给attribute变量
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

  // 设置<canvas>的背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空<canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制一个点
  gl.drawArrays(gl.POINT, 0, 1);
}

/**
 * 鼠标点击位置数组
 */
const g_points = [];

/**
 * canvas 点击事件
 * @param {*} ev
 * @param {*} gl
 * @param {*} canvas
 * @param {*} a_Position
 */
function click(ev, gl, canvas, a_Position) {
  // 鼠标点击的 x 坐标
  let x = ev.clientX;
  // 鼠标点击的 y 坐标
  let y = ev.clientY;

  // ?
  let rect = ev.target.getBoundingClientRect();
  // ?
  x = (x - rect.left - canvas.height / 2) / (canvas.height / 2);
  // ?
  y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);

  // 将坐标存储到 g_points 数组中
  g_points.push(x);
  g_points.push(y);

  // 清除 <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  let len = g_points.length;
  for (let i = 0; i < len; i += 2) {
    // 将点的位置传递到变量中 a_Position
    gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);
    // 绘制点
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
