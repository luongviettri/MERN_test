import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SkeletonElement from './SkeletonElement';
import Skimmer from './Skimmer';

export default function SkeletonProductDetail() {
  const myArray = [1, 2, 3];
  const SkeletenParagraph = () => {
    return (
      <>
        <SkeletonElement type="title" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
      </>
    );
  };

  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-article">
        <Container className="m-0 p-0">
          <Row>
            <Col className="m-0 p-0" xs={4}>
              <SkeletonElement type="picture" />
            </Col>
            <Col className="mx-5 p-0" xs={4}>
              {SkeletenParagraph()}
            </Col>
            <Col className="mx-5 p-0">{SkeletenParagraph()}</Col>
          </Row>
          <Row>
            <Col className="m-0 p-0" xs={4}></Col>
            <Col className="m-2 p-0">
              {myArray.map(() => {
                return SkeletenParagraph();
              })}
            </Col>
          </Row>
        </Container>
      </div>
      <Skimmer />
    </div>
  );
}
