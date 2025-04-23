const Breadcrumbs = () => {
  const crumbs = ["Category 1", "Category 2", "Category 3"];

  return (
    <section className="mx-18 my-6 ">
      <div className="breadcrumbs text-2xl pb-4 border-b border-gray-300">
        <ul>
          <li>
            <span className="font-semibold">Books</span>
          </li>
          <li>
            <span className="font-light">{crumbs[0]}</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Breadcrumbs;
