import React from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { Container, Title, LinkList, Header } from './post-styles';

const TriangleRight = styled.div`
  display: inline-block;
  vertical-align: bottom;
  width: 0;
  height: 0;
  margin-left: 4px;
  border-left: 10px solid #1b864c;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
`;

const TriangleLeft = styled.div`
  display: inline-block;
  vertical-align: bottom;
  width: 0;
  height: 0;
  margin-right: 4px;
  border-right: 10px solid #1b864c;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
`;

const TagLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  background-color: #ddd;
  padding: 4px 8px;
  border-radius: 6px;
  color: black;
  &:hover{
    background-color: #eee;
    color: #333;
  }
`;


class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const tags = post.frontmatter.tags;
    const { previous, next } = this.props.pageContext;

    console.log('tags', tags);

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <Container>
          <Header>
            <Title>{post.frontmatter.title}</Title>
            <div>
              <sub
                css={`
                  color: rgba(0, 0, 0, 0.8);
                `}
              >
                {post.frontmatter.version > 1 &&
                  <span>更新日: {post.frontmatter.date}</span>  
                }
                {!post.frontmatter.version <= 1 &&
                  <span>作成日: {post.frontmatter.date}</span>  
                }
                <span>&nbsp; - &nbsp;</span>
                <span>{post.fields.readingTime.text}</span>
              </sub>
            </div>
            <div>
              <sub>
              {
                tags && tags.map((t) => {
                  return (
                    <TagLink href={`/tags/${t}`}>
                      {t}
                    </TagLink>
                  );
                })
              }
              </sub>
            </div>
          </Header>
          <div
            css={`
              margin: 5rem 0;
            `}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <hr></hr>
          <LinkList>
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  <TriangleLeft/> {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} <TriangleRight/>
                </Link>
              )}
            </li>
          </LinkList>
        </Container>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      fields {
        readingTime {
          text
        }
      }
      frontmatter {
        title
        date(formatString: "YYYY年MM月DD日")
        version
        tags
      }
    }
  }
`;
