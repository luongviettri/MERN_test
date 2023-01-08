import React from 'react';
import SkeletonElement from './SkeletonElement';
import Skimmer from './Skimmer';

export default function SkeletonArticle() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-article">
        <SkeletonElement type="title" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
        <Skimmer />
      </div>
    </div>
  );
}
