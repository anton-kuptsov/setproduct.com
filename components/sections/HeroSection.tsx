type Props = {
  title: string;
  description: string;
};

export default function HeroSection({ title, description }: Props) {
  return (
    <div className="section">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="blog_hero-section">
            <div className="heading-left-text-wr max-width-900">
              <h1 className="heading-style-h1">{title}</h1>
              <div className="heading-style-h6">
                {description.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < description.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
