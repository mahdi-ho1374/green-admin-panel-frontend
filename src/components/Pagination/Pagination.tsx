import React, { FC, MouseEvent } from "react";

import classes from "./Pagination.module.css";

const Pagination: FC<{
  lastPage: number;
  currentPage: number;
  onChange: (selectedPage: number) => void;
}> = ({ lastPage, currentPage, onChange }) => {
  const pageHandler = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    if (target.tagName !== "BUTTON") {
      return;
    }
    const content = target.textContent;
    const selectedPage =
      Number(content) > 0
        ? Number(content)
        : content === "Previous"
        ? currentPage - 1
        : currentPage + 1;
    onChange(selectedPage);
  };

  return (
    <>{lastPage === 1  ? <></> : 
    <div className={classes.pagination} onClick={pageHandler}>
      <button
        className={`${classes.pagination__page} ${classes["pagination__page--previous"]}`}
        disabled={currentPage === 1}
        onMouseDown={(e) => e.preventDefault()}
        key="Previous"
      >
        Previous
      </button>
      {currentPage !== 1 && (
        <button className={classes.pagination__page} key="first">
          1
        </button>
      )}

      {currentPage > 4 && (
        <button
          className={`${classes.pagination__page} ${classes["pagination__page--dots"]}`}
          key="dots-1"
        >
          ...
        </button>
      )}

      {currentPage > 3 && (
        <button className={classes.pagination__page} key={currentPage - 2}>
          {currentPage - 2}
        </button>
      )}

      {currentPage > 2 && (
        <button className={classes.pagination__page} key={currentPage - 1}>
          {currentPage - 1}
        </button>
      )}

      <button
        className={`${classes.pagination__page} ${classes["pagination__page--active"]}`}
        key={currentPage}
      >
        {currentPage}
      </button>

      {currentPage < lastPage - 1 && (
        <button className={classes.pagination__page} key={currentPage + 1}>
          {currentPage + 1}
        </button>
      )}

      {currentPage < lastPage - 2 && (
        <button className={classes.pagination__page} key={currentPage + 2}>
          {currentPage + 2}
        </button>
      )}

      {currentPage < lastPage - 3 && (
        <button
          className={`${classes.pagination__page} ${classes["pagination__page--dots"]}`}
          key="dots-2"
        >
          ...
        </button>
      )}

      {currentPage !== lastPage && (
        <button className={classes.pagination__page} key="last">
          {lastPage}
        </button>
      )}
      <button
        className={`${classes.pagination__page} ${classes["pagination__page--next"]}`}
        disabled={currentPage === lastPage}
        onMouseDown={(e) => e.preventDefault()}
        key="Next"
      >
        Next
      </button>
    </div>}</>
  );
};

export default Pagination;
