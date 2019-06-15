import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';

import Header from './header';
import media from '../utils/media';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: system;
    font-style: normal;
    font-weight: 300;
    src: local('.SFNSText-Light'), local('.HelveticaNeueDeskInterface-Light'),
      local('.LucidaGrandeUI'), local('Ubuntu Light'), local('Segoe UI Light'),
      local('Roboto-Light'), local('DroidSans'), local('Tahoma');
  }

  :root {
    font-size: 10px;
  }

  body {
    font-family: 'system';
    margin: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    color: rgba(0, 0, 0, 0.8);
    min-height: 100vh;
    position: relative;
    font-size: 1.6rem;
    background-color: #1b864c;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Oswald', sans-serif;
  }

  h2 {
    font-size: 2.5rem;
  }

  h3 {
    font-size: 2.0rem;
  }

  h4 {
    font-size: 1.6rem;
  }
  
  code {
    font-family: Menlo,Monaco,"Courier New",Courier,monospace;
    word-break: break-word;
  }

  pre code {
    word-break: normal;
  }

  :not(pre) > code[class*="language-"], pre[class*="language-text"] {
    background-color: transparent;
    color: inherit;
    font-size: medium;
  }

  .gatsby-highlight-code-line {
    background-color: #7f2d2d;
    display: block;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 0.75em;
    border-left: 0.25em solid #f99;
    color: 
  }

  .gatsby-code-title {
    background: #1b864c;
    color: #fff;
    margin-bottom: -0.65em;
    padding: 0.8rem 1.05rem;
    font-size: 0.8em;
    line-height: 0.4;
    font-weight: 600;
    border-radius: 4px 4px 0 0;
    display: table;
  }

`;

const Footer = styled.footer`
  display: block;
  height: 6rem;
`;

const Content = styled.div`
  width: 60%;
  max-width: 728px;
  margin: 0 auto;
  padding: 10px 30px 30px;
  background-color: white;

  ${media.tablet`
    width: 80%;
  `}
`;

class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => (
          <>
            <Header title={data.site.siteMetadata.title} />
            <Content>{children}</Content>
            <Footer />
            <GlobalStyles />
          </>
        )}
      />
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
