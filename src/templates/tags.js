import React from "react";
import Layout from '../components/layout';
import SEO from '../components/seo';
import Bio from '../components/bio';
import Post from '../components/post';
import Title from '../components/title';

export default class TagsTemplate extends React.Component {
  render() {
    const tag = this.props.pathContext.tag;
    const { data } = this.props;
    const posts = data.allMarkdownRemark.edges;
    return (
      <Layout>
        <SEO title="記事一覧" keywords={[`gatsby`, `blog`, `react`, `emotion`, `ie`]} />
        <Bio />
        <main>
          <Title>「{tag}」タグの記事</Title>
          {posts.map(({ node }) => {
            return <Post key={node.id} node={node} />;
          })}
        </main>
      </Layout>
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