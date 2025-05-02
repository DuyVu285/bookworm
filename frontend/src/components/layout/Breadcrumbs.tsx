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
      <div className="breadcrumbs text-4xl">
        <span className="font-semibold">{type}</span>
        {value !== undefined && value && (
          <span className="font-light ml-2">(Filtered by {value})</span>
        )}
      </div>
    </>
  );
};

export default Breadcrumbs;
