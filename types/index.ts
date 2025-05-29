import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Review = {
  createdate: string;
  reviewbody: string;
  reviewdate: string;
  reviewer: string;
  reviewer_itemname: string;
  reviewtitle: string;
  stars: string;
};
