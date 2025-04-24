const Breadcrumbs = ({
  selectedFilter,
}: {
  selectedFilter?: { type: string; value: string | number };
}) => {
  return (
    <section>
      <div className="breadcrumbs text-4xl">
        <span className="font-semibold">{selectedFilter?.type ?? "Books"}</span>
        <span className="font-light ml-2">
          ({selectedFilter ? "Filtered by" : ""} {selectedFilter?.value})
        </span>
      </div>
    </section>
  );
};

export default Breadcrumbs;
