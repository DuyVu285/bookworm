const Breadcrumbs = ({
  selectedFilter,
}: {
  selectedFilter: { type: string | null; value: string | null };
}) => {
  const crumbs = [];

  if (selectedFilter.type && selectedFilter.value) {
    crumbs.push(`${selectedFilter.value}`);
  }

  return (
    <section>
      <div className="breadcrumbs text-2xl ">
        <ul>
          <li>
            <span className="font-semibold">Books</span>
          </li>
          {crumbs.map((crumb, index) => (
            <li key={index}>
              <span className="font-light">Filtered by {crumb}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Breadcrumbs;
