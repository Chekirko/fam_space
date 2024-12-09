import React from "react";

import LocalSearch from "@/components/search/LocalSearch";

const FindUser = () => {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-5 sm:px-16">
      <div className="mx-auto flex max-w-[800px] items-center justify-center">
        <LocalSearch
          route="/find-user"
          imgSrc="/search.svg"
          placeholder="Find user..."
          otherClasses=""
        />
      </div>
    </section>
  );
};

export default FindUser;
