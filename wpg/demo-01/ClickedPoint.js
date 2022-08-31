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
  /**
   * //////////////////////////////////
   * 1. 获取鼠标点击的位置，并存储在一个数组中
   * //////////////////////////////////
   */

  /**
   * 不能直接使用这两个坐标值！！！
   * 1. 鼠标点击位置的坐标时“浏览器客户区“（client area）中的坐标，而不是在 <canvas> 中的
   * 2. <canvas> 的坐标系统与 webgl 的坐标系统，其原点位置和Y轴的正方向都不一样
   */

  /**
   * 首先，你需要将坐标从浏览器客户区坐标系下转换到 <canvas> 坐标系下，然后再转换到 WebGL 坐标系下
   * 怎么做呢？如下：
   */

  // 首先，获取在浏览器中的点击坐标
  let x = ev.clientX;
  let y = ev.clientY;
  console.log('浏览器点击坐标', `x = ${x}`, `y = ${y}`);

  // 然后，获取 <canvas> 在浏览器中的坐标
  // `rect.left`, `rect,top` 是 <canvas> 的原点在浏览器中的坐标，
  // 这样 `rect.left`, `rect,top` 就可以将点击坐标（x,y）转换为<canvas>坐标系下的坐标了

  // 接下来，<canvas>坐标转换为 webgl 坐标:

  // 第 1 步：
  // 是要知道 <canvas> 的中心点：
  // 获取 <canvas> 宽高：canvas.height, canvas,width，
  // 中心坐标即为：(canvas.height / 2, canvas.height / 2)

  // 第 2 步：
  // 使用 `(x - rect.left) - canvas.width / 2` 和 `canvas.height / 2 - (y - rect.top)`
  // 将 <canvas> 的原点平移到中心点（即 webgl 坐标系的原点）

  // 第 3 步：
  // <canvas> 的 x 轴坐标区间从 0 到 `canvas.width(400)`，而其 y 轴区间从 0 到 `canvas.height(400)`
  // 因为 webgl 的坐标区间为从 -1.0 到 1.0
  // 所以将 <canvas> 坐标映射到 webgl 坐标，需要：
  // 将 x 坐标除以 `canvas.width / 2`, 将 y 坐标除以 `canvas.height / 2`

  let rect = ev.target.getBoundingClientRect();

  console.log('<canvas>', `width = ${rect.width}`, `height = ${rect.height}`);
  console.log('<canvas>坐标', `left = ${rect.left}`, `top = ${rect.top}`);

  x = (x - rect.left - canvas.height / 2) / (canvas.height / 2);
  y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);

  // 将坐标存储到 `g_points` 数组中
  g_points.push([x, y]); // 优化

  console.log('webgl坐标', `x = ${x}`, `y = ${y}`);

  /**
   * //////////////////////////////////
   * 2. 清空 <canvas>
   * //////////////////////////////////
   */

  // 清除 <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  /**
   * //////////////////////////////////
   * 3. 根据数组的每个元素，在相应的位置绘制点
   * //////////////////////////////////
   */

  let len = g_points.length;
  for (let i = 0; i < len; i++) {
    // 将点的位置传递到变量中 a_Position
    const xy = g_points[i];
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // 绘制点
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
