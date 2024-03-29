import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import StyledLink from '../utils/styled-link';
import media from '../utils/media';

const Container = styled.nav`
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1b864c;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  margin: 0;
  color: #fff;

  ${media.phone`
    text-align: center;
  `}
`;

const Header = ({ title }) => (
  <Container>
    <StyledLink to={'/'}>
      <Title>{title}</Title>
    </StyledLink>
  </Container>
);

Header.defaultProps = {
  title: '',
};

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;
