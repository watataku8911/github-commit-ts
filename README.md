# github-commit/typescript

> typescript の練習で「github-commit」を typescript で書き直した。

- 本番環境 → [https://github.com/watataku8911/github-commit](https://github.com/watataku8911/github-commit)

## typescriptで書くための準備

```
$ npm install --save typescript
$ npm install --save @types/node

# tsconfig.jsonを生成してくれる
$ npx tsc --init

# ts-nodeはjsのトランスパイルなしにtsコードを実行してくれる
$ npm install --save ts-node
```

## 必要パッケージ

```
$ npm install express
$ npm install -D @types/express

$ npm install twitter
$ npm install -D @types/twitter
```
