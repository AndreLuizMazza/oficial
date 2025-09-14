# Tema Progem Docs — Como ajustar as cores exatas

As variáveis no arquivo `src/styles/globals.css` já estão mapeadas para uma paleta próxima da documentação:

```css
--doc-primary-500 / 600 / 700   /* azul */
--doc-success-500               /* verde */
--doc-warn-500                  /* amarelo */
--doc-bg / --doc-surface / --doc-surface-2 /* superfícies */
--doc-border                    /* bordas */
--doc-fg / --doc-muted          /* textos */
```

Para ficar **100% igual** à documentação oficial, basta substituir os HEX acima pelos valores exatos do site de docs.
Não é necessário mudar o restante do código: todos os componentes usam tokens `--c-*` já conectados a `--doc-*`.
