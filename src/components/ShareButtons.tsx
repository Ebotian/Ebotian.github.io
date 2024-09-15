'use client'

import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';

export default function ShareButtons({ title }: { title: string }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const hashtag = `#${encodeURIComponent(title.replace(/\s+/g, ""))}`;

  return (
    <div className="flex space-x-4 mt-8">
      <FacebookShareButton url={url} hashtag={hashtag}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
}
