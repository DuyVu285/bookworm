const BookDetails = () => {
  return (
    <section>
      <div className="flex flex-col lg:flex-row border border-gray-300">
        {/* Aside Image */}
        <aside className="w-full lg:w-1/3">
          {" "}
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Book"
            className="h-60 w-full object-cover"
          />
          <span className="flex justify-end p-2">By Author</span>
        </aside>

        {/* Book Details */}
        <div className="w-full lg:w-2/3 p-4">
          <h2 className="text-2xl font-semibold">Book Title</h2>
          <span>Book Description</span> <br />
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
            <br />
            The standard chunk of Lorem Ipsum used since the 1500s is reproduced
            below for those interested. Sections 1.10.32 and 1.10.33 from "de
            Finibus Bonorum et Malorum" by Cicero are also reproduced in their
            exact original form, accompanied by English versions from the 1914
            translation by H. Rackham.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookDetails;
