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
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor; // 设置颜色
  }
`;

/**
 * 主函数
 * @returns
 */
function main() {
  // 获取 <canvas> 元素
  const canvas = document.getElementById('app');

  // 获取 webgl 绘图上下文
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

  // 获取 attribute 变量的存储位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // 获取 u_FragColor 变量的存储位置
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

  // 注册鼠标点击事件响应函数
  canvas.onmousedown = function (ev) {
    click(ev, gl, canvas, a_Position, u_FragColor);
  };

  // 将顶点位置传输给 attribute 变量
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

  // 设置 <canvas> 的背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空 <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
 * 鼠标点击位置数组
 */
const g_points = [];

/**
 * 存储点颜色的数组
 */
const g_colors = [];

/**
 * canvas 点击事件
 * @param {*} ev
 * @param {*} gl
 * @param {*} canvas
 * @param {*} a_Position
 */
function click(ev, gl, canvas, a_Position, u_FragColor) {
  let x = ev.clientX;
  let y = ev.clientY;

  let rect = ev.target.getBoundingClientRect();
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = -(y - (rect.top + canvas.height / 2)) / (canvas.height / 2);

  // 将坐标存在到 g_points 数组中
  g_points.push([x, y]);

  // 将点的颜色存储到 g_colors 数组中
  if (x >= 0.0 && y >= 0.0) {
    // 第一象限
    g_colors.push([1.0, 0.0, 0.0, 1.0]); // 红色
  } else if (x < 0.0 && y < 0.0) {
    // 第三象限
    g_colors.push([0.0, 1.0, 0.0, 1.0]); // 绿色
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0]); // 白色
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  let len = g_points.length;
  for (let i = 0; i < len; i++) {
    // 将点的位置传递到 a_Position 变量中
    const xy = g_points[i];
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

    // 将点的颜色传输到 u_FragColor 变量中
    const rgba = g_colors[i];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // 绘制点
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
