import Link from "next/link";

export default function NotFound() {
  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <h1 className="nhsuk-heading-xl">Page not found</h1>
        <p className="nhsuk-body">
          If you typed the web address, check it is correct.
        </p>
        <p className="nhsuk-body">
          <Link href="/" className="nhsuk-link">
            Go back to the homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
