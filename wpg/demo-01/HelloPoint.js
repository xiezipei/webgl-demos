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

  // 初始化着色器

  /**
   * 辅助函数 initShaders()：对字符串形式的着色器进行初始化
   *
   * 参数说明：
   * gl 指定渲染上下文
   * vshader 指定顶点着色器程序代码（字符串）
   * fshader 指定片元着色器程序代码（字符串）
   */

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
