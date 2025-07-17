import { Link } from "@heroui/link";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-pretty">
      <h1 className="text-3xl font-bold mb-4">About</h1>

      <p className="mb-8 mt-8 font-bold text-lg">
        ArchiveFlix is an open-source project, and contributions are welcome!{" "}
        <Link
          href="https://github.com/stepanvanzuriak/archiveflix"
          isExternal
          showAnchorIcon
        >
          github.com/stepanvanzuriak/archiveflix
        </Link>
      </p>

      <p className="mb-4">
        <strong>ArchiveFlix</strong> is a platform that brings together films,
        series, documentaries, and more — all sourced directly from{" "}
        <Link href="https://archive.org/" isExternal showAnchorIcon>
          archive.org
        </Link>
        , a public, nonprofit digital library.
      </p>

      <p className="mb-6">
        The goal is to make this rich, often forgotten archive more accessible
        and enjoyable through a modern UI.
      </p>

      <h2 className="text-xl font-semibold mb-2">Important Notes</h2>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>
          All media and metadata are provided <strong>as-is</strong> from
          archive.org.
        </li>
        <li>
          Due to the nature of historical content, some material may be{" "}
          <strong>disturbing, outdated, or offensive</strong>.
        </li>
        <li>
          Users can mark content as <strong>“Not Interested”</strong> to tailor
          their experience.
        </li>
        <li>
          While content rating filters (like R ratings){" "}
          <strong>may be introduced</strong>, their availability is{" "}
          <strong>not guaranteed</strong>.
        </li>
      </ul>

      <p>
        This project is an independent effort and is{" "}
        <strong>not affiliated with or endorsed by archive.org</strong>.
      </p>
    </div>
  );
}
