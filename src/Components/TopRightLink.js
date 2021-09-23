import React from "react";
import { Link } from "react-router-dom";

export default function TopRightLink({ route, tag }) {
  return (
    <Link className="top-right-link" to={`${route}`}>
      {tag}
    </Link>
  );
}
