import React from 'react';

const ResizableLines = () => {
  return (
    <>
      {/* left*/}
      <div className={`absolute z-50 w-1.5 h-[20%] rounded-lg bg-slate-200 -left-px top-[40%]`}></div>
      {/* top*/}
      <div className={`absolute z-50 w-[14%] h-1.5 rounded-lg bg-slate-200 left-[40%] -top-px`}></div>
      {/* right*/}
      <div className={`absolute z-50 w-1.5 h-[20%] rounded-lg bg-slate-200 -right-px top-[40%]`}></div>
      {/* bottom*/}
      <div className={`absolute z-50 w-[14%] h-1.5 rounded-lg bg-slate-200 left-[40%] -bottom-px`}></div>
    </>
  );
};

export default ResizableLines;
