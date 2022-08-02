import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload'; // 热更新 后续确认详细原理 这块之前没看过原理
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/index.js',
  output: [
    {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/bundle.js',
    },
    {
      format: 'esm',
      file: 'dist/index.esm.js',
    },
  ],
  plugins: [
    svelte({
      compilerOptions: {
        // 在非生产环境中开启运行时检查
        customElement: true,
        dev: !production,
      },
    }),
    // 将所有组件中的 CSS 提取进一个文件——提高性能
    css({ output: 'bundle.css' }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),

    // 在非生产环境中，在打包生成后运行 `npm run start`
    !production && serve(),

    // 在非生产环境中，在 `public` 目录中有改动时刷新浏览器
    !production && livereload('public'),

    // 如果为生产环境进行构建（npm run build 而不是 npm run dev）,
    // minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
