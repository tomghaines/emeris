interface Prop {
  data: string | number;
  type: string;
}

const TableCol = (props: Prop) => {
  return (
    <div
      id="table-cell"
      className={
        props.type === 'header'
          ? 'w-full flex flex-col items-start gap-3 py-3 px-2'
          : 'w-full flex flex-col items-start gap-3 py-3 px-2 border-b-2 border-neutral-800'
      }
    >
      <p
        id="cell-text"
        className={
          props.type === 'header'
            ? 'text-xs font-semibold leading-5 uppercase text-neutral-400'
            : 'text-sm font-normal leading-5 text-neutral-300'
        }
      >
        {props.data}
      </p>
    </div>
  );
};

export default TableCol;
