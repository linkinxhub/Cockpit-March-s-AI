import{defineConfig,globalIgnores}from'eslint/config';import nextVitals from'eslint-config-next/core-web-vitals';
export default defineConfig([...nextVitals,{rules:{'react-hooks/set-state-in-effect':'off','react-hooks/static-components':'off','@next/next/no-html-link-for-pages':'off'}},globalIgnores(['dist/**','.next/**','android/**','ios/**','macos/**','windows/**','linux/**'])]);
