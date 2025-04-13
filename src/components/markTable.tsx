import { classMark } from "@/db/schema";
import MarkQueryHeader from "./markQueryHeader";

type Props = {
    jobMarks: typeof classMark.$inferSelect[]
}

export default function MarkTable(props: Props) {
    return (
        <>
            <MarkQueryHeader />
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="px-4 py-2 text-left border-b">课程名称</th>
                            <th className="px-4 py-2 text-left border-b">教室信息</th>
                            <th className="px-4 py-2 text-left border-b">星期</th>
                            <th className="px-4 py-2 text-left border-b">节次</th>
                            <th className="px-4 py-2 text-left border-b">完成时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.jobMarks.map((mark) => (
                            <tr key={mark.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-2 border-b">{mark.name}</td>
                                <td className="px-4 py-2 border-b">{mark.class_and_room}</td>
                                <td className="px-4 py-2 border-b">周{mark.week + 1}</td>
                                <td className="px-4 py-2 border-b">第{mark.order + 1}节</td>
                                <td className="px-4 py-2 border-b">
                                    {new Date(mark.finishDate).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}