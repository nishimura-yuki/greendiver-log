const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const componentBlogPost = path.resolve(`./src/templates/blog-post.js`);
    const componentTags = path.resolve(`./src/templates/tags.js`);

    resolve(
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

        console.log('tag set', tagSet);

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

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
