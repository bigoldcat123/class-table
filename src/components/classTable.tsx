import ClassOrder from "@/components/classOrder";
import TableCell, { TableCellProp } from "@/components/tableCell";
import clsx from "clsx";

type Props = {
    classes: Map<string, TableCellProp>
}
export default function ClassTable({ classes }:Props) {
    const date = new Date()
    const day = date.getDay() == 0 ? 6 : date.getDay() - 1;
    return (
        <div className=" w-[80%] mx-auto flex mt-2">
            {/* side column */}
            <div className=" w-[7vw]">
                <div>e</div>
                {
                    Array.from({ length: 7 }).map((_, idx) => <div className={clsx("h-[5vw] mt-2 flex items-center", { " mt-[3vw]": idx == 2 || idx == 6 || idx == 4 })} key={idx}><ClassOrder order={idx} timeSpan="9:00~10:00" key={idx} /></div>)
                }
            </div>
            {/* head and main */}
            <div className=" flex-1">
                <header className=" flex justify-around">
                    {
                        Array.from({ length: 7 }).map((_, idx) => <div className={clsx(" px-4 py-1",{ " bg-blue-400 dark:bg-blue-900": day ==idx})} key={idx}>周{idx + 1}</div>)
                    }
                </header>
                <main>
                    {
                        Array.from({ length: 7 }).map((_, order) => {
                            return <section className={clsx("flex justify-around mt-2", {
                                "mt-[3vw]": order == 2 || order == 4 || order == 6,
                            })} key={order}>
                                {
                                    Array.from({ length: 7 }).map((_, week) => <TableCell className={clsx({"border-blue-400 dark:border-blue-900":week == day})} clx={classes.get(week + "" + order)} key={week} coordinate={{order,week}} />)
                                }
                            </section>
                        })
                    }
                </main>
            </div>
        </div>
    );
}
