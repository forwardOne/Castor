import path from "path";
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true, // describe, it, expect などをグローバルで使えるようにする
    environment: 'jsdom', // JSDOM環境でテストを実行（Reactコンポーネントの描画に必要）
    setupFiles: './src/setupTests.ts', // テスト前の共通処理ファイル
    // テストファイルを src/**.test.(ts|tsx) のパターンで認識させる
    include: ['**/*.test.?(c|m)[jt]s?(x)'],
  },
})
