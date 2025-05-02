const Breadcrumbs = ({
  type,
  value,
}: {
  type?: string;
  value?: string | number;
}) => {
  if (!type) return null;
  return (
    <>
      <div className="breadcrumbs text-4xl border-b border-gray-300 py-6 mb-4">
        <span className="font-semibold">{type}</span>
        {value !== undefined && value && (
          <span className="ml-2 text-gray-400 font-light">
            (Filtered by {value})
          </span>
        )}
      </div>
    </>
  );
};

export default Breadcrumbs;
