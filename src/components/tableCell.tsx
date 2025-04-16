"use client";
import {
  markAsFinishedAction,
  swicthAction,
  TableCellPropActionFrom,
  TableCellPropActionTo,
} from "@/action";
import clsx from "clsx";

export type TableCellProp = {
  name: string;
  classAndRoom: string;
  isTemp: boolean;
  isFinished: boolean;
};
export type Coordinate = {
  week: number;
  order: number;
};
type Props = {
  clx: TableCellProp | undefined;
  className?: string;
  coordinate: Coordinate;
};
export default function TableCell({ clx, className, coordinate }: Props) {
  const markAsFinished = async () => {
    if (!clx || clx.isFinished) {
      return;
    }
    if (confirm("完成？")) {
      await markAsFinishedAction({ clazz: clx!, coordinate });
    }
  };

  return (
    <>
      <div
        draggable={clx && !clx.isFinished}
        onDragStart={(e) => {
          e.dataTransfer.setData(
            "coordinate",
            JSON.stringify({ coordinate, tableCell: clx }),
          );
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (clx?.isFinished) {
            alert("不可以这么换哦！");
            return;
          }
          const from = JSON.parse(
            e.dataTransfer.getData("coordinate"),
          ) as TableCellPropActionFrom;
          const to: TableCellPropActionTo = {
            coordinate,
            tableCell: clx,
          };
          if (
            from.coordinate.week == to.coordinate.week &&
            from.coordinate.order == to.coordinate.order
          ) {
            alert("不可以这么换哦！");
            return;
          }
          swicthAction(from, to);
        }}
        onClick={() => markAsFinished()}
        className={clsx(
          " cursor-pointer min-w-[9vw] max-w-[9vw] px-2 h-[5vw] border-2 flex flex-col items-center justify-center",
          className,
          {
            "border-amber-500": clx?.isTemp,
            "bg-green-400": clx?.isFinished,
          },
        )}
      >
        <h1 className=" text-[1.5vw]">{clx?.name}</h1>
        <p className=" text-[1vw]">{clx?.classAndRoom}</p>
      </div>
    </>
  );
}
