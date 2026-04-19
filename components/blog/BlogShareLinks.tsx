"use client";
import { useState } from "react";

type BlogShareLinksProps = {
  url: string;
  title: string;
};

export default function BlogShareLinks({ url, title }: BlogShareLinksProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      void _;
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="blogpost_content-share-wr">
      <p className="text-size-medium text-weight-bold">Share this post</p>
      <div className="blogpost_soc-links-wr">
        <div style={{ display: copied ? "block" : "none" }} className="sign">
          <div className="text-size-regular">Link copied</div>
        </div>
        <a href="#" className="blogpost_soc-link w-inline-block" onClick={handleCopy}>
          <img
            src="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/64da3623c6b6445dda31b373_Share_Button1.svg"
            loading="lazy"
            alt="Copy icon"
            className="image-cover"
          />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="blogpost_soc-link w-inline-block"
        >
          <img
            src="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/64da362c08672efcb68f2fb8_008-linkedin_1.svg"
            loading="lazy"
            alt="Linkedin icon"
            className="image-cover"
          />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="blogpost_soc-link w-inline-block"
        >
          <img
            src="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/64da3622343169203760f4d4_Share_Button2.svg"
            loading="lazy"
            alt="Facebook icon"
            className="image-cover"
          />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="blogpost_soc-link w-inline-block"
        >
          <img
            src="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/64da3659bdb68b1847ca0535_002-twitter.svg"
            loading="lazy"
            alt="Twitter icon"
            className="image-cover"
          />
        </a>
      </div>
    </div>
  );
}
