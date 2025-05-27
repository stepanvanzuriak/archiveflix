const Player = ({ slug }: { slug: string }) => {
  return (
    <>
      <div className="mb-10 h-[580px] flex items-center justify-center">
        <iframe
          loading="lazy"
          key={slug}
          src={`https://archive.org/embed/${slug}&playlist=1&list_height=100`}
          width="640"
          height="580"
          frameBorder="0"
          allowFullScreen
          title={slug}
        />
      </div>
    </>
  );
};

export default Player;
