import InternetArchive from "internetarchive-sdk-js";

const { S3 } = process.env || {};

const ia = new InternetArchive(S3, { testmode: true });

export const getItems = async (
  filters: {
    collection?: string;
    subject?: string;
    creator?: string;
  },
  page: number = 1,
  opts: { sort?: string } = {},
) => {
  const options = {
    rows: "12",
    fields: "identifier",
    page,
    sort: "num_reviews desc",
    ...opts,
  };

  return ia.getItems({ filters, options });
};

export const getItem = async (id: string) => {
  return ia.getItem(id);
};
