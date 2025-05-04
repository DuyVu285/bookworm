import MainLayout from "../layout/MainLayout";

const AboutPage = () => {
  return (
    <MainLayout type="About">
      <div className="flex flex-col text-2xl justify-center items-center mx-4 sm:mx-12 lg:mx-50 p-4">
        <h1 className="text-3xl font-bold pb-5">Welcome to Bookworm</h1>
        <p className="leading-relaxed max-w-3xl">
          "Bookworm is an independent New York bookstore and language school
          with locations in Manhattan and Brooklyn. We specialize in travel
          books and language classes."
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 py-6 gap-10">
          <div>
            <h1 className="text-3xl font-bold pb-5">Our Story</h1>
            <p className="leading-relaxed">
              The name Bookworm was taken from the original name for New York
              International Airport, which was renamed JFK in December 1963.
              <br />
              Our Manhattan store has just moved to the West Village. Our new
              location is 170 7th Avenue South, at the corner of Perry Street.
              <br />
              From March 2008 through May 2016, the store was located in the
              Flatiron District.
            </p>
          </div>
          <div>
            <h1 className="text-3xl font-bold pb-5">Our Vision</h1>
            <p className="leading-relaxed">
              One of the last travel bookstores in the country, our Manhattan
              store carries a range of guidebooks all 10% off to suit the needs
              and tastes of every traveller and budget.
              <br />
              We believe that a novel or travelogue can be just as valuable a
              key to a place as any guidebook, and our well-read, well-travelled
              staff is happy to make reading recommendations for any traveller,
              book lover, or gift giver.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
