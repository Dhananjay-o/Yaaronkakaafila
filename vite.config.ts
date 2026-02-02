export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    base: './',

    plugins: [react()],

    build: {
      outDir: 'dist',
      emptyOutDir: true
    },

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  }
})
