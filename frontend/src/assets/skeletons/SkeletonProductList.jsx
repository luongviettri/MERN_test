import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SkeletonElement from './SkeletonElement';
import Skimmer from './Skimmer';

export default function SkeletonProductList() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-article">
        <Container className="m-0 p-0">
          <Row>
            <Col className="m-0 p-0" xs={5}>
              <SkeletonElement type="picture" />
            </Col>
            <Col className="mx-5 p-0">
              <SkeletonElement type="title" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="title" />
            </Col>
          </Row>
        </Container>
      </div>
      <Skimmer />
    </div>
  );
}
