/**
 * 着色器程序说明
 * - 和 C 语言程序一样，必须包含一个 main 函数
 * - main 函数前面关键字 `void` 表示这个函数不会有返回值，你也不能为 main 指定参数
 * - `gl_Position` 必须赋值，否则着色器无法正常工作
 * - `gl_PointSize` 非必须，默认值 1.0
 * - GLSL ES 是一种强类型的编程语言，必须指明某个变量是什么类型
 * - `vec4` 是由 3 个浮点数组成的矢量(xyz 坐标值)，而 `vec4()` 是着色器内置函数会帮我们转化为 vec4 类型的变量
 */

// 顶点着色器（GLSL ES语言）
const VSHADER_SOURCE = `
    void main() {
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0); // 设置坐标
        gl_PointSize = 10.0; // 设置尺寸
    }
`;

// 片着色器（GLSL ES语言）
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 设置颜色
    }
`;

function main() {
  // 获取<canvas>元素
  const canvas = document.getElementById('app');

  // 获取webgl绘图上下文
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  /**
   * 辅助函数 `initShaders()` 说明
   *
   * 作用：
   * - 对字符串形式的着色器进行初始化
   *
   * 参数说明：
   * - `gl` 指定渲染上下文
   * - `vshader` 指定顶点着色器程序代码（字符串）
   * - `fshader` 指定片元着色器程序代码（字符串）
   *
   * 返回值说明：
   * - `true` 成功
   * - false 失败
   */

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // 设置<canvas>的背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // 清空<canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 绘制一个点
  gl.drawArrays(gl.POINT, 0, 1);
}
