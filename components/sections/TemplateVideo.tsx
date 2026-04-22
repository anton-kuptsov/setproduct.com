"use client";

type Props = {
  videoUrl: string;
  title?: string;
  subtitle?: string;
};

export default function TemplateVideo({ videoUrl, title, subtitle }: Props) {
  const getEmbedUrl = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/)([^&?]+)/);
    if (youtubeMatch) {
      return `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?rel=0&controls=0&autoplay=1&mute=1&start=0`;
    }
    return url;
  };

  return (
    <div className="section">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          {(title || subtitle) && (
            <div className="heading-center-wr is-template-page">
              {title && <h2 className="heading-style-h2">{title}</h2>}
              {subtitle && <div className="heading-style-h5 mob-18">{subtitle}</div>}
            </div>
          )}
          {(title || subtitle) && <div className="spacer-64" />}
          <div className="template_video-wr">
            <div className="w-embed-youtubevideo" style={{ paddingTop: "56.17%" }}>
              <iframe
                allow="autoplay; encrypted-media"
                allowFullScreen
                frameBorder="0"
                src={getEmbedUrl(videoUrl)}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "auto",
                }}
                title={title || "Video"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
