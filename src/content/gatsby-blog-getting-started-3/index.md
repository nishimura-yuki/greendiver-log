---
date: "2019-06-14T02:00:00Z"
version: 1
title: "Gatsbyを使ったブログ構築メモ その3"
tags: ["javascript", "gatsby"]
---

[前回(ステップ2)](/gatsby-blog-getting-started-2/)の続きになります。
<br/>
<br/>

## ステップ3. テンプレートをベースにブログの機能を拡張(細かい動きやスタイルなど)

今回のブログ移行にあたってテンプレートに以下の修正を加えました。

- ブログのメタ情報を修正(ブログタイトル, Authorなど)
- hタグにアンカーリンクを貼れるようにプラグインを追加
- 記事内のリンクを別タブ(`target=_blank`) で開くようにプラグインを追加
- タグ機能の実装

これ以外にも細かい修正はしていますが、上記内容がカスタマイズの代表例かと思うのでフォーカスして紹介していきます。
<br/>
<br/>

### ブログのメタ情報を修正(ブログタイトル, Authorなど)

Gatsbyで作成したサイト(ブログ)のメタ情報は `gatsby-config.js` に記述されています。  
ライブラリからプロジェクトを作成した場合、デフォルトだとライブラリ提供者の情報が記載されていたりするので、それを修正しましょう。

```javascript:title=例：gatsby-config.js
module.exports = {
  // siteMetadata が全体で共通の設定になる
  // 値を追加することも可能
  siteMetadata: {
    title: `GreenDiver.log`,
    description: `技術ブログ`,
    author: `greendiver234`,
    authorTagline: '自称フルスタックエンジニア',
  },
  /* ... 中略 ... */
};
```
<br/>

### hタグにアンカーリンクを貼れるようにする
Gatsbyでマークダウンを使ったページ生成を行うには `gatsby-transformer-remark` というプラグインを利用します。
(スクラッチでこのプラグインを導入する場合のサンプルも[公式ページ](https://www.gatsbyjs.org/docs/adding-markdown-pages/)にあります)

で、このプラグインですがデフォルトだと `見出し要素(hタグ)` にid属性が付与できないので `gatsby-remark-autolink-headers` というプラグインを別途使う必要があります。  
さらに言うと、このプラグインは上述した `gatsby-transformer-remark` と連動して機能させる必要があるので、プラグインの指定は以下のように記述する必要があります。

```javascript:title=例：gatsby-config.js
module.exports = {
  /* ... 中略 ... */
  
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      // gatsby-transformer-remark と連動させるプラグインを
      // ネストして指定するようなイメージ
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
        ]
      }
    }
  ],

  /* ... 中略 ... */
};
```

`gatsby-remark-autolink-headers` にはさらにオプションの指定も可能ですが、それらは[プラグイン情報ページ](https://www.gatsbyjs.org/packages/gatsby-remark-autolink-headers/)で確認するとよいです。
<br/>
<br/>

### 記事内のリンクを別タブで開くようにする
ブログでは「記事内の外部リンクは別タブで表示させたい」といったケースもあるかと思います。
それを実現するためには `gatsby-remark-external-links` プラグインを使います。

```javascript:title=例：gatsby-config.js
module.exports = {
  /* ... 中略 ... */
  
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      // gatsby-transformer-remark と連動させるプラグインを
      // ネストして指定するようなイメージ
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-external-links`,
            options: {
              // target=_blankの脆弱性対策
              rel: "noopener noreferrer",
            }
          },
        ]
      }
    }
  ],

  /* ... 中略 ... */
};
```

`gatsby-remark-external-links` も[プラグイン情報ページ](https://www.gatsbyjs.org/packages/gatsby-remark-external-links/)があるので細かい調整はこちらを参考するとよいです。  
また、小ネタですが `target=_blank` には `window.opener API` を利用した脆弱性もあるため利用する場合は上の設定例のように、併せて `rel=noopener noreferrer` をしておくことをおすすめします。  
参考情報: https://qiita.com/Terryy/items/eeabfc838eea1ed65023
<br/>
<br/>

### タグ機能の実装
Wordpressで使っていたタグ機能も引き続き利用したかったのでこちらは独自に実装しました。  
実装した内容は
1. タグに関連する記事一覧ページを作成
2. 1で作成したページを`Gatsby`のページ生成処理に組み込む

となります。

実装時には `Ogura Daiki` さんの[記事](http://hachibeedi.github.io/entry/how-to-add-category-and-tags-page/)を参考にさせていただきました。
<br/>
<br/>

#### 1.タグに関連する記事一覧ページを作成
細かい説明は省略しますが、GatsbyにはReactで作成したComponentを各ページのテンプレートとして利用する機能があります。
これを利用して各タグごとの記事一覧ページのテンプレートを用意します。

```javascript:title=例：tags.js
import React from "react";

export default class TagsTemplate extends React.Component {
  render() {
    const tag = this.props.pathContext.tag;
    const { data } = this.props;
    const posts = data.allMarkdownRemark.edges;
    return (
      <div>
        <main>
          <h1>「{tag}」タグの記事</h1>
          <ul>
          {posts.map(({ node }) => {
            return (
              <li key={node.id}>
                <a href={node.fields.slug}>
                  <div>
                    <p>{node.frontmatter.title}</p>
                    <p>{node.frontmatter.date}</p>
                    <p>{node.excerpt}</p>
                  </div>
                </a>
              </li>
            );
          })}
          </ul>
        </main>
      </div>
    );
  }
}


export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          id
          excerpt(pruneLength: 160)
          fields {
            slug
            readingTime {
              text
            }
          }
          frontmatter {
            title
            date(formatString: "YYYY年MM月DD日")
          }
        }
      }
    }
  }
`
```

Reactで作成されたComponent(TagsTemplate)についてはReactに慣れていれば違和感なく読み解けると思います。  
問題はファイル下部にある `graphql` で、簡単に中身を説明すると
```dot{showLineNumbers: false}
dateが新しい順で最大1000件、 指定された「tag」と同じtagを持つ記事情報を取得する
```
という意図の graphql クエリになっています。
<br/>
<br/>

#### 2. 1で作成したページを`Gatsby`のページ生成処理に組み込む
Gatsbyで静的ページを生成する処理は `gatsby-node.js` に記載します。
すでに各記事ページを生成する処理がある前提で`gatsby-node.js` へタグ一覧ページの生成処理を組み込むサンプルが以下になります。

```javascript{numberLines: true}
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const componentBlogPost = path.resolve(`./src/templates/blog-post.js`);
    const componentTags = path.resolve(`./src/templates/tags.js`);

    resolve(
      // 作成日の新しい順に最大1000件の記事情報を取得
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // graphqlで取得した記事情報
        const posts = result.data.allMarkdownRemark.edges;
        const tagSet = new Set();

        // 記事ページを作成
        posts.forEach((post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;

          createPage({
            path: post.node.fields.slug,
            component: componentBlogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          });

          // タグ情報を記録
          const tags = post.node.frontmatter.tags;
          tags.forEach(t => tagSet.add(t));
        });

        // タグごとの一覧ページを作成
        Array.from(tagSet).forEach(tag => {
          createPage({
            path: `/tags/${tag}/`,
            component: componentTags,
            context: {
              tag
            }
          })
        });

      })
    );
  });
};
```

順に解説していきます。

6行目の `componentTags` の宣言はタグ一覧ページのテンプレート(手順1で作成したもの)を指定するためのものになります。  
サンプルでは `src/templates/tags.js` というファイルで存在している前提になっていますが、これは適宜作成したファイル名に応じて変更してください。

11~30行目はすべての記事記事情報を取得するための `graphql` になります。  

42~54行目で各記事ページを生成しています。生成しながら57,58行目で各記事に設定したタグ情報を記録しています。

62~70行目でいよいよタグ一覧ページを生成しています。  
タグごとに `/tags/${tag}/` というURLで一覧ページにアクセスできるようにしつつ、componentに6行目で宣言した `componentTags` を指定することで一覧ページを生成しています。
<br/>
<br/>


## 次のステップ 

ステップ3はここまでです。  
次のステップではGithub & Netlifyを使ったブログの公開について紹介します。


