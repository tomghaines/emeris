interface Prop {
  data: string | number;
  type: string;
}

const TableCol = (props: Prop) => {
  return (
    <div className="flex flex-col w-full">
      <p className={props.type === 'header' ? 'font-bold pb-2' : 'pt-1'}>
        {props.data}
      </p>
    </div>
  );
};

export default TableCol;
